import { getOptimizedImageUrl } from '../../utils/image';

export const ImageGallery = ({ images, title }) => {
  const mainImage = getOptimizedImageUrl(images?.[0]);

  return (
    <div className="relative h-full min-h-[340px] bg-md-surface-container-low lg:min-h-[560px] lg:border-b-0">
      <img 
        src={mainImage} 
        alt={title}
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
};