import { useWishlistStore } from "../store/wishlistStore";
import { useAuth } from "./useAuth";

export const useWishlist = () => {
    const { user } = useAuth();
    const userId = user?.id || 'guest';
    const getItems = useWishlistStore((state) => state.getItems);
    const toggleItem = useWishlistStore((state) => state.toggleItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist);
    const clearWishlist = useWishlistStore((state) => state.clearWishlist);

    return {
        items: getItems(userId),
        toggleItem: (product) => toggleItem(product, userId),
        isInWishlist: (productId) => isInWishlist(productId, userId),
        clearWishlist: () => clearWishlist(userId)
    };
}