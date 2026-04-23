import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useWishlistStore = create()(
  persist(
    (set, get) => ({
      itemsByUser: {},

      getItems: (userId = 'guest') => get().itemsByUser[userId] || [],
      
      toggleItem: (product, userId = 'guest') => {
        const currentItems = get().itemsByUser[userId] || [];
        const exists = currentItems.find((item) => item.id === product.id);

        if (exists) {
          set((state) => ({
            itemsByUser: {
              ...state.itemsByUser,
              [userId]: currentItems.filter((item) => item.id !== product.id)
            }
          }));
        } else {
          set((state) => ({
            itemsByUser: {
              ...state.itemsByUser,
              [userId]: [...currentItems, product]
            }
          }));
        }
      },
      
      removeItem: (productId, userId = 'guest') => 
        set((state) => ({
          itemsByUser: {
            ...state.itemsByUser,
            [userId]: (state.itemsByUser[userId] || []).filter((item) => item.id !== productId)
          }
        })),
      
      clearWishlist: (userId = 'guest') =>
        set((state) => ({
          itemsByUser: {
            ...state.itemsByUser,
            [userId]: []
          }
        })),

      setItemsForUser: (items, userId = 'guest') =>
        set((state) => ({
          itemsByUser: {
            ...state.itemsByUser,
            [userId]: Array.isArray(items) ? items : []
          }
        })),
      
      isInWishlist: (productId, userId = 'guest') =>
        (get().itemsByUser[userId] || []).some((item) => item.id === productId),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);