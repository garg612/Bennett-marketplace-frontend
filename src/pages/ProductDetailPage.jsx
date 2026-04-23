import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

import { Button } from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Spinner } from '../components/ui/Spinner';
import { productService } from '../services/productService';

// Import our newly architected components!
import { ImageGallery } from '../components/product/ImageGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductDescription } from '../components/product/ProductDescription';
import { SellerCard } from '../components/product/SellerCard';
import { ActionButtons } from '../components/product/ActionButtons';
import { RelatedListings } from '../components/product/RelatedListings';
import { motionTokens } from '../utils/motion';

export const ProductDetailPage = () => {
  const pageRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleVerificationChanged = (verification) => {
    if (!verification) {
      return;
    }

    setProduct((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        seller: {
          ...prev.seller,
          studentVerification: {
            ...prev.seller?.studentVerification,
            ...verification
          }
        }
      };
    });
  };

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load this listing.');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.js-detail-reveal',
        { autoAlpha: 0, y: motionTokens.pageRevealYOffset },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionTokens.pageRevealDuration,
          ease: motionTokens.ease,
          stagger: motionTokens.pageRevealStagger,
        }
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [product?.id, isLoading]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <ErrorMessage 
          title={error ? 'Unable to load listing' : 'Listing Not Found'}
          message={error || 'The item you are looking for might have been sold or removed by the seller.'}
          action={<Button variant="outline" onClick={() => navigate('/listings')}>Back to Marketplace</Button>}
        />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="js-detail-reveal focus-ring mb-8 flex min-h-[44px] items-center rounded-full border border-md-outline bg-md-surface-container px-5 py-2 text-label text-md-on-background transition-all duration-300 ease-material hover:bg-md-secondary-container"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to listings
      </button>

      <div className="js-detail-reveal overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-md">
        <div className="grid min-h-[560px] grid-cols-12">
          
          <div className="col-span-12 lg:col-span-7">
            <ImageGallery images={product.images} title={product.title} />
          </div>

          <div className="col-span-12 flex h-full flex-col justify-between border-l-0 border-md-outline/35 p-6 sm:p-8 lg:col-span-5 lg:border-l">
            <div>
              <ProductInfo product={product} />
              <ProductDescription description={product.description} />
              <SellerCard seller={product.seller} productId={product.id} onVerificationChanged={handleVerificationChanged} />
            </div>
            
            <ActionButtons product={product} />
          </div>

        </div>
      </div>

      <div className="js-detail-reveal">
        <RelatedListings />
      </div>
      </div>
    </div>
  );
};