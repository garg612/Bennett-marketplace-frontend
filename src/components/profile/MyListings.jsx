import { Link } from 'react-router-dom';
import { Package, Edit } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatPrice } from '../../utils/formatPrice';
import { getOptimizedImageUrl } from '../../utils/image';

export const MyListings = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <EmptyState 
        icon={Package}
        title="No active listings"
        description="You haven't posted any items for sale yet."
        action={
          <Link to="/create-listing">
            <Button variant="outline">Post your first item</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-card-title font-medium tracking-tight text-md-on-background">Active Listings</h3>
        <Badge variant="secondary">{listings.length} Items</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((product) => (
          <div key={product.id} className="group flex gap-4 rounded-[24px] bg-md-surface-container-low p-4 shadow-md-sm transition-all duration-300 ease-material hover:scale-[1.01] hover:shadow-md-md">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-md-surface-container">
              <img src={getOptimizedImageUrl(product.images[0])} alt={product.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 ease-material group-hover:scale-105" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <Link to={`/listings/${product.id}`} className="focus-ring mb-1 truncate rounded-md text-sm font-medium text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary">
                {product.title}
              </Link>
              {product.status === 'reserved' && (
                <span className="mb-1 inline-flex w-fit rounded-full bg-md-tertiary px-2 py-1 text-[10px] font-medium text-md-on-tertiary">
                  Reserved
                </span>
              )}
              {product.status === 'sold out' && (
                <span className="mb-1 inline-flex w-fit rounded-full bg-md-primary px-2 py-1 text-[10px] font-medium text-md-on-primary">
                  Sold Out
                </span>
              )}
              <p className="text-sm font-medium text-md-primary">{formatPrice(product.price)}</p>
              <div className="mt-1 text-xs text-md-on-background/70">{product.views} views</div>
              <div className="mt-auto flex justify-end">
                <div className="flex items-center gap-3">
                  {product.status === 'reserved' && (
                    <Link to="/profile?tab=requests" className="focus-ring rounded-md text-xs font-medium text-md-on-background hover:text-md-primary">
                      Manage reserve
                    </Link>
                  )}
                  <Link to={`/listings/${product.id}/edit`} className="focus-ring flex items-center rounded-md text-xs font-medium text-md-on-background hover:text-md-primary">
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};