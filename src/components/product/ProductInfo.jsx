import { Clock, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import { WishlistButton } from '../listings/WishlistButton';
import { useAuth } from '../../hooks/useAuth';

export const ProductInfo = ({ product }) => {
  const { user } = useAuth();
  const isOwnListing = Boolean(user?.id) && String(product?.seller?.id || '') === String(user.id);

  return (
    <div className="mb-8 border-b border-md-outline/35 pb-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-[10px]">
          {product.category}
        </Badge>
        <Badge variant="outline" className="text-md-on-background">
          Condition: {product.condition}
        </Badge>
        {product.status === 'reserved' && (
          <Badge className="bg-md-tertiary text-md-on-tertiary">
            RESERVED
          </Badge>
        )}
        {product.status === 'sold out' && (
          <Badge className="bg-md-on-background text-md-background">
            SOLD OUT
          </Badge>
        )}
        {!isOwnListing && (
          <WishlistButton 
            product={product} 
            className="" 
          />
        )}

      </div>
      
      <h1 className="mb-2 text-subtitle font-medium leading-tight tracking-tight text-md-on-background sm:text-section">
        {product.title}
      </h1>
      <p className="mb-2 text-subtitle font-medium text-md-primary sm:text-[42px]">
        {formatPrice(product.price)}
      </p>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-md-outline/35 pt-4 text-sm text-md-on-background/75 sm:grid-cols-2">
        <div className="flex items-center gap-2 border-b border-md-outline/35 pb-3 sm:border-b-0 sm:pb-0">
          <Clock className="h-4 w-4" />
          <span>Posted {formatDateTime(product.listedAt || product.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Bennett University</span>
        </div>
      </div>
    </div>
  );
};