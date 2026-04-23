import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { CreateListingForm } from '../components/create-listing/CreateListingForm';
import { useToastStore } from '../store/useToastStore';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

export const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [isForbidden, setIsForbidden] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: 'Good',
    description: '',
    imageFiles: []
  });

  const categoryOptions = categoryService.getAllCategories().map((cat) => ({
    value: cat.toLowerCase(),
    label: cat
  }));

  const conditionOptions = [
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Used', label: 'Used' }
  ];

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoadingProduct(true);
      setError('');

      try {
        const product = await productService.getProductById(id);
        const isOwner = Boolean(user?.id) && String(product?.seller?.id || '') === String(user.id);

        if (!isOwner) {
          setIsForbidden(true);
          return;
        }

        setFormData({
          title: product.title || '',
          price: String(product.price || ''),
          category: product.category || '',
          condition: product.condition || 'Good',
          description: product.description || '',
          imageFiles: []
        });
      } catch (loadError) {
        setError(loadError.message || 'Unable to load listing for editing.');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, user?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imageFiles') {
      setFormData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...Array.from(files || [])].slice(0, 5)
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updated = await productService.updateProduct(id, {
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        imageFiles: formData.imageFiles
      });

      addToast('Listing updated successfully.');
      navigate(`/listings/${updated.id}`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update listing.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="mx-auto max-w-3xl">
        <ErrorMessage
          title="Edit not allowed"
          message="You can only edit listings created by your account."
        />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-20">
      <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit Listing"
        subtitle="Update your item details and keep your listing fresh."
      />
      <div className="overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-md">
        <CreateListingForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          categoryOptions={categoryOptions}
          conditionOptions={conditionOptions}
          onRemoveImage={handleRemoveImage}
          submitLabel="Save Changes"
          onCancel={() => navigate(-1)}
        />
      </div>
      </div>
    </div>
  );
};
