import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../authService';
import { apiClient } from '../../api/client';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and normalizes user payload', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        user: { _id: 'u1', name: 'Test User', email: 'test@bennett.edu.in' },
        accessToken: 'token-123'
      }
    });

    const result = await authService.login({ email: 'test@bennett.edu.in', password: 'secret123' });

    expect(apiClient.post).toHaveBeenCalledWith('/api/users/login', {
      email: 'test@bennett.edu.in',
      password: 'secret123'
    });
    expect(result.user.id).toBe('u1');
    expect(result.token).toBe('token-123');
  });

  it('signs up and returns normalized user', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        user: { _id: 'u2', name: 'New User', email: 'new@bennett.edu.in' },
        accessToken: 'token-456'
      }
    });

    const result = await authService.signup({
      name: 'New User',
      email: 'new@bennett.edu.in',
      password: 'secret123'
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/users/register', {
      name: 'New User',
      email: 'new@bennett.edu.in',
      password: 'secret123'
    });
    expect(result.user.email).toBe('new@bennett.edu.in');
  });

  it('fetches current user profile', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        user: { _id: 'u3', name: 'Profile User', email: 'profile@bennett.edu.in' }
      }
    });

    const user = await authService.getCurrentUser();

    expect(apiClient.get).toHaveBeenCalledWith('/api/users/profile');
    expect(user.id).toBe('u3');
  });

  it('logs out through API', async () => {
    apiClient.post.mockResolvedValue({ success: true });

    const result = await authService.logout();

    expect(apiClient.post).toHaveBeenCalledWith('/api/users/logout', {});
    expect(result).toBe(true);
  });
});