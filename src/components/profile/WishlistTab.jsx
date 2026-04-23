import { useEffect, useMemo, useRef } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import { ProductCard } from '../listings/ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';

export const WishlistTab = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const items = useWishlistStore((state) => state.getItems(userId));
  const removeItem = useWishlistStore((state) => state.removeItem);
  const setItemsForUser = useWishlistStore((state) => state.setItemsForUser);
  const lastSyncedKeyRef = useRef('');

  const filteredItems = useMemo(
    () => items.filter((item) => String(item?.seller?.id || '') !== String(user?.id || '')),
    [items, user?.id]
  );

  useEffect(() => {
    const ownItems = items.filter((item) => String(item?.seller?.id || '') === String(user?.id || ''));
    ownItems.forEach((item) => removeItem(item.id, userId));
  }, [items, removeItem, user?.id, userId]);

  useEffect(() => {
    let mounted = true;

    const refreshWishlistProducts = async () => {
      if (!items.length) {
        lastSyncedKeyRef.current = '';
        return;
      }

      const idKey = items.map((item) => String(item?.id || '')).join('|');
      if (idKey === lastSyncedKeyRef.current) {
        return;
      }

      lastSyncedKeyRef.current = idKey;

      const refreshed = await Promise.all(
        items.map(async (item) => {
          try {
            return await productService.getProductById(item.id);
          } catch {
            return item;
          }
        })
      );

      if (mounted) {
        setItemsForUser(refreshed, userId);
      }
    };

    refreshWishlistProducts();

    return () => {
      mounted = false;
    };
  }, [items, setItemsForUser, userId]);

  if (filteredItems.length === 0) {
    return (
      <EmptyState 
        icon={Heart}
        title="Your wishlist is empty"
        description="Save items you're interested in to view them later."
        action={<Link to="/listings"><Button variant="outline">Browse Items</Button></Link>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300 sm:grid-cols-2">
      {filteredItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};