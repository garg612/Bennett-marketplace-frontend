/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import AppRouter from '../AppRouter';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../services/productService', () => ({
  productService: {
    getProductById: vi.fn().mockResolvedValue({
      id: '1',
      title: 'Test Product',
      price: 199,
      images: ['https://example.com/product.jpg'],
      seller: { id: 'seller-1', name: 'Seller One' }
    }),
    getProductsBySellerId: vi.fn().mockResolvedValue([]),
    getAllProducts: vi.fn().mockResolvedValue([]),
    getFeaturedProducts: vi.fn().mockResolvedValue([])
  }
}));

const authUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test.user@bennett.edu.in',
  avatar: 'https://example.com/avatar.png'
};

const protectedRouteCases = [
  { path: '/create-listing', expectedText: 'Post an Item', expectedKind: 'heading' },
  { path: '/chat', expectedText: 'Messages', expectedKind: 'heading' },
  { path: '/profile', expectedText: 'My Profile', expectedKind: 'heading' }
];

describe('Protected routes integration', () => {
  beforeAll(() => {
    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = vi.fn();
    }
  });

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    useAuthStore.setState({ isAuthenticated: false, user: null });
    window.history.replaceState({}, '', '/');
  });

  describe('when unauthenticated', () => {
    it.each(protectedRouteCases)('redirects from $path to home route', async ({ path }) => {
      window.history.pushState({}, '', path);

      render(<AppRouter />);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/');
      });

      expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
    });
  });

  describe('when authenticated', () => {
    it.each(protectedRouteCases)('allows access to $path', async ({ path, expectedText, expectedKind }) => {
      useAuthStore.setState({ isAuthenticated: true, user: authUser });
      window.history.pushState({}, '', path);

      render(<AppRouter />);

      if (expectedKind === 'heading') {
        expect(await screen.findByRole('heading', { name: expectedText })).toBeTruthy();
      } else {
        expect(await screen.findByText(expectedText)).toBeTruthy();
      }

      expect(window.location.pathname).toBe(path);
    });
  });
});