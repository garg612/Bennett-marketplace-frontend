import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productService } from '../productService';
import { apiClient } from '../../api/client';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns normalized products list', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        products: {
          docs: [
            {
              _id: 'p1',
              name: 'Book',
              description: 'Book desc',
              price: 100,
              category: 'books',
              image: 'https://example.com/book.jpg',
              seller: { _id: 'u1', name: 'Seller One', email: 'seller@bennett.edu.in' },
              createdAt: '2024-01-01T00:00:00.000Z'
            }
          ]
        }
      }
    });

    const products = await productService.getAllProducts();

    expect(apiClient.get).toHaveBeenCalledWith('/api/products?page=1&limit=50');
    expect(products).toHaveLength(1);
    expect(products[0].id).toBe('p1');
    expect(products[0].title).toBe('Book');
    expect(products[0].images[0]).toBe('https://example.com/book.jpg');
  });

  it('returns product by id', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        product: {
          _id: 'p2',
          name: 'Laptop',
          description: 'Laptop desc',
          price: 500,
          category: 'electronics',
          image: 'https://example.com/laptop.jpg',
          seller: { _id: 'u2', name: 'Seller Two' }
        }
      }
    });

    const product = await productService.getProductById('p2');

    expect(apiClient.get).toHaveBeenCalledWith('/api/products/p2');
    expect(product?.id).toBe('p2');
  });

  it('returns seller-specific products', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        products: {
          docs: [
            { _id: 'p1', name: 'A', price: 10, category: 'books', image: 'x', seller: { _id: 'seller-1', name: 'Seller 1' } },
            { _id: 'p2', name: 'B', price: 20, category: 'books', image: 'y', seller: { _id: 'seller-2', name: 'Seller 2' } }
          ]
        }
      }
    });

    const sellerProducts = await productService.getProductsBySellerId('seller-1');

    expect(sellerProducts).toHaveLength(1);
    expect(sellerProducts[0].seller.id).toBe('seller-1');
  });

  it('creates a product through API', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        product: {
          _id: 'p3',
          name: 'Headphones',
          description: 'Great audio',
          price: 250,
          category: 'electronics',
          image: 'https://example.com/headphones.jpg',
          seller: { _id: 'seller-3', name: 'Seller 3' }
        }
      }
    });

    const created = await productService.createProduct({
      title: 'Test Product',
      price: 100,
      category: 'Books',
      condition: 'Good',
      description: 'Test'
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/products/createproduct', expect.any(FormData));
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Headphones');
  });

  it('buys a product through API', async () => {
    apiClient.post.mockResolvedValue({ data: { order: { _id: 'o1' } } });

    const order = await productService.buyProduct('p1');

    expect(apiClient.post).toHaveBeenCalledWith('/api/products/buyproduct/p1', {});
    expect(order._id).toBe('o1');
  });
});