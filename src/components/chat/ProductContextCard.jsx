import { Package } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const ProductContextCard = ({ participant, product }) => {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-md-outline/35 bg-md-surface-container px-6">
      <div className="flex items-center gap-3">
        <Avatar src={participant.avatar} name={participant.name} size="sm" />
        <div>
          <h3 className="text-sm font-medium text-md-on-background">{participant.name}</h3>
          <p className="flex items-center text-xs text-md-on-background/70">
            <Package className="h-3 w-3 mr-1" />
            {product.title} - ₹{product.price}
          </p>
        </div>
      </div>
    </div>
  );
};