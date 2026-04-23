import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chatService } from '../chatService';
import { apiClient } from '../../api/client';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const storage = new Map();
    globalThis.localStorage = {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
      clear: () => storage.clear()
    };
    globalThis.localStorage.clear();
  });

  it('returns normalized conversations from API', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        conversations: [
          {
            _id: 'c1',
            participant: { _id: 'u1', name: 'John Doe' },
            product: { _id: 'p1', name: 'Book', price: 100 },
            messages: [{ _id: 'm1', sender: 'u1', text: 'Hello' }]
          }
        ]
      }
    });

    const conversations = await chatService.getAllConversations();

    expect(apiClient.get).toHaveBeenCalledWith('/api/chats');
    expect(conversations).toHaveLength(1);
    expect(conversations[0].id).toBe('c1');
    expect(conversations[0].messages[0].id).toBe('m1');
  });

  it('falls back to local storage when API fails', async () => {
    globalThis.localStorage.setItem(
      'chat-fallback-conversations',
      JSON.stringify([
        {
          id: 'local-1',
          participant: { id: 'u1', name: 'Local User' },
          product: { id: 'p1', title: 'Local Product', price: 10 },
          messages: []
        }
      ])
    );
    apiClient.get.mockRejectedValue(new Error('network down'));

    const conversations = await chatService.getAllConversations();

    expect(conversations).toHaveLength(1);
    expect(conversations[0].id).toBe('local-1');
  });

  it('returns null when adding message to unknown conversation', async () => {
    const result = await chatService.addMessage('missing-id', {
      senderId: 'me',
      text: 'Hello',
      timestamp: new Date().toISOString()
    });

    expect(result).toBeNull();
  });

  it('adds message to local storage when message API fails', async () => {
    globalThis.localStorage.setItem(
      'chat-fallback-conversations',
      JSON.stringify([
        {
          id: 'c1',
          participant: { id: 'u1', name: 'User 1' },
          product: { id: 'p1', title: 'Product 1', price: 100 },
          messages: []
        }
      ])
    );
    apiClient.post.mockRejectedValue(new Error('message endpoint missing'));

    const createdMessage = await chatService.addMessage('c1', {
      senderId: 'me',
      text: 'New test message',
      timestamp: new Date().toISOString()
    });

    expect(createdMessage?.id).toBeDefined();

    const stored = JSON.parse(globalThis.localStorage.getItem('chat-fallback-conversations'));
    expect(stored[0].messages).toHaveLength(1);
    expect(stored[0].messages[0].text).toBe('New test message');
  });
});