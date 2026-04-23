import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { CreateListingForm } from '../components/create-listing/CreateListingForm';
import { useToastStore } from '../store/useToastStore';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    imageFiles: []
  });

  const categoryOptions = categoryService.getAllCategories().map(cat => ({
    value: cat.toLowerCase(),
    label: cat
  }));

  const conditionOptions = [
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imageFiles') {
      setFormData((prev) => {
        const incomingFiles = Array.from(files || []);
        return {
          ...prev,
          imageFiles: [...prev.imageFiles, ...incomingFiles].slice(0, 5)
        };
      });
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (!formData.imageFiles.length) {
      setError('Please upload at least one image for your listing.');
      return;
    }

    setIsLoading(true);

    try {
      const createdProduct = await productService.createProduct({
        title: formData.title,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        imageFiles: formData.imageFiles,
        seller: { id: user.id, name: user.name, avatar: user.avatar }
      });

      addToast('Listing created successfully.');
      navigate(`/listings/${createdProduct.id}`);
    } catch (createError) {
      setError(createError.message || 'Unable to create listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-20">
      <div className="mx-auto max-w-3xl">
      <PageHeader 
        title="Post an Item" 
        subtitle="Sell to fellow Bennett students."
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
          onCancel={() => navigate(-1)}
        />
      </div>
      </div>
    </div>
  );
};