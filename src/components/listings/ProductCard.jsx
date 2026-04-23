import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import { ConditionBadge } from './ConditionBadge';
import { WishlistButton } from './WishlistButton';
import { useAuth } from '../../hooks/useAuth';
import { getOptimizedImageUrl } from '../../utils/image';

export const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const isOwnListing = Boolean(user?.id) && String(product?.seller?.id || '') === String(user.id);
  const sellerVerificationStatus = product?.seller?.studentVerification?.status;
  const hasVerificationInfo = typeof sellerVerificationStatus === 'string' && sellerVerificationStatus.length > 0;
  const isSellerVerified = sellerVerificationStatus === 'verified';
  const isFraudSeller = sellerVerificationStatus === 'fraud';
  const sellerName = product?.seller?.name || 'Unknown Seller';
  const productImage = getOptimizedImageUrl(product?.images?.[0] || product?.image || 'https://via.placeholder.com/600x400?text=No+Image');

  return (
    <div className="relative group"> 
      {!isOwnListing && (
        <div className="absolute top-3 left-3 z-20">
          <WishlistButton product={product} />
        </div>
      )}

      <Link 
        to={`/listings/${product.id}`}
        className="flex h-full flex-col overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-sm transition-all duration-300 ease-material hover:scale-[1.02] hover:shadow-md-md"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-md-surface-container-low">
          <img 
            src={productImage}
            alt={product?.title || 'Listing image'}
            loading='lazy'
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product?.status === 'reserved' && (
            <div className="absolute inset-0 flex items-center justify-center bg-md-primary/30 backdrop-blur-[2px]">
              <span className="rounded-full bg-md-on-primary/90 px-4 py-2 text-label font-medium tracking-wide text-md-primary">
                RESERVED
              </span>
            </div>
          )}
          {product?.status === 'sold out' && (
            <div className="absolute inset-0 flex items-center justify-center bg-md-on-background/45 backdrop-blur-[2px]">
              <span className="rounded-full bg-md-on-background/90 px-4 py-2 text-label font-medium tracking-wide text-md-background">
                SOLD OUT
              </span>
            </div>
          )}
          {/* Condition Badge stays on the right */}
          <div className="absolute top-3 right-3">
            <ConditionBadge condition={product.condition} />
          </div>
          {hasVerificationInfo && (
            <div className={`absolute bottom-3 right-3 rounded-full px-2 py-1 text-[10px] font-medium ${
              isFraudSeller
                ? 'bg-md-tertiary/20 text-md-tertiary'
                : isSellerVerified
                  ? 'bg-md-secondary-container text-md-on-secondary-container'
                  : 'bg-md-surface-container-low text-md-on-background/70'
            }`}>
              {isFraudSeller ? 'Fraud Seller' : (isSellerVerified ? 'Verified Seller' : 'Unverified Seller')}
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="line-clamp-2 text-body font-medium text-md-on-background">{product.title}</h3>
            <p className="shrink-0 text-card-title font-medium text-md-primary">{formatPrice(product.price)}</p>
          </div>
          
          <div className="mt-auto flex items-center justify-between border-t border-md-outline/20 pt-4 text-xs text-md-on-background/70">
            <span className="truncate pr-2">{sellerName}</span>
            <span className="shrink-0">{formatDateTime(product.listedAt)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};