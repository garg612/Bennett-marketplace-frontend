import { PackageX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export const ListingsGrid = ({ products, onClearFilters }) => {
  if (products.length === 0) {
    return (
      <div className="rounded-[24px] bg-md-surface-container shadow-md-sm">
        <EmptyState 
          icon={PackageX}
          title="No items found"
          description="We couldn't find any items matching your search criteria. Try adjusting your filters."
          action={
            <Button variant="outline" onClick={onClearFilters}>
              Clear all filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      {products.map((product) => (
        <div key={product.id} className="col-span-12 md:col-span-6 lg:col-span-4">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};