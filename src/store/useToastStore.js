import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  // Add a toast to the list
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  // Manual remove (for the 'X' button)
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));