import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { useAuth } from '../../hooks/useAuth';

export const WishlistButton = ({ product, className = "" }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const isOwnListing = Boolean(user?.id) && String(product?.seller?.id || '') === String(user.id);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product?.id, userId));
  const addToast = useToastStore((state) => state.addToast);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOwnListing) {
      addToast('You cannot wishlist your own listing.', 'info');
      return;
    }

    if (product) {
      toggleItem(product, userId);
      addToast(
        isWishlisted
          ? "Item removed from wishlist"
          : "Item added to wishlist",
        isWishlisted ? "info" : "success"
      );
    }
  };

  if (isOwnListing) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      className={`focus-ring z-30 rounded-full bg-md-surface-container p-2 shadow-md-sm transition-all duration-300 ease-material hover:scale-110 hover:bg-md-secondary-container ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isWishlisted ? 'fill-md-primary text-md-primary' : 'text-md-on-background'
        }`}
      />
    </button>
  );
};