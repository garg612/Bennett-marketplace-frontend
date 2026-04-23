// Assuming you import mockUsers to attach the seller easily
import { mockUsers } from './users';

export const mockProducts = [
  {
    id: 1,
    title: 'MacBook Air M1',
    category: 'Electronics',
    price: 55000,
    condition: 'Used',
    description: 'A well-maintained laptop with minor scratches on the bottom case. Perfect for coding.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop'],
    seller: mockUsers[0],
    listedAt: '2024-06-01T09:00:00Z',
    views: 120,
    tags: ['laptop', 'macbook', 'urgent']
  },
  {
    id: 2,
    title: 'Calculus Textbook - Stewart 8th Edition',
    category: 'Books',
    price: 800,
    condition: 'Like New',
    description: 'Barely used calculus textbook, perfect for engineering students. Comes with access code.',
    images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop'],
    seller: mockUsers[1],
    listedAt: '2024-05-28T14:30:00Z',
    views: 85,
    tags: ['textbook', 'calculus', 'stewart']
  },
];