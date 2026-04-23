import { apiClient } from '../api/client';

const CHAT_STORAGE_KEY = 'chat-fallback-conversations';

const normalizeMessage = (message) => ({
  id: String(message.id || message._id || Date.now()),
  senderId: String(message.senderId || message.sender?._id || message.sender || 'unknown'),
  text: message.text || '',
  timestamp: message.timestamp || message.createdAt || new Date().toISOString()
});

const normalizeConversation = (conversation) => {
  const participant = conversation.participant || conversation.user || {};
  const product = conversation.product || conversation.listing || {};

  return {
    id: String(conversation.id || conversation._id),
    participant: {
      id: String(participant.id || participant._id || ''),
      name: participant.name || 'Unknown User',
      avatar: participant.avatar || ''
    },
    product: {
      id: String(product.id || product._id || ''),
      title: product.title || product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.image || product.images?.[0] || ''
    },
    messages: Array.isArray(conversation.messages)
      ? conversation.messages.map(normalizeMessage)
      : [],
    unreadCount: Number(conversation.unreadCount || 0)
  };
};

const getStoredConversations = () => {
  if (typeof globalThis === 'undefined' || typeof globalThis.localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = globalThis.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeConversation) : [];
  } catch {
    return [];
  }
};

const setStoredConversations = (conversations, options = {}) => {
  const { emitEvent = true } = options;

  if (typeof globalThis === 'undefined' || typeof globalThis.localStorage === 'undefined') {
    return;
  }

  globalThis.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));

  if (emitEvent && typeof globalThis.dispatchEvent === 'function') {
    globalThis.dispatchEvent(new CustomEvent('chat:updated'));
  }
};

export const chatService = {
  async getAllConversations() {
    try {
      const response = await apiClient.get('/api/chats');
      const conversations = response?.data?.conversations || [];
      const normalized = conversations.map(normalizeConversation);

      if (normalized.length > 0) {
        setStoredConversations(normalized, { emitEvent: false });
        return normalized;
      }
    } catch {
      // Fall back to local chat cache until backend chat endpoints are available.
    }

    return getStoredConversations();
  },

  async getInboxSummary() {
    try {
      const response = await apiClient.get('/api/chats');
      const conversations = (response?.data?.conversations || []).map(normalizeConversation);
      const totalUnread = Number(response?.data?.totalUnread || 0);

      // Avoid recursion: Navbar listens to chat:updated and calls getInboxSummary again.
      setStoredConversations(conversations, { emitEvent: false });
      return { conversations, totalUnread };
    } catch {
      const conversations = getStoredConversations();
      const totalUnread = conversations.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0);
      return { conversations, totalUnread };
    }
  },

  async startConversation(productId, participantId) {
    const payload = participantId ? { productId, participantId } : { productId };
    const response = await apiClient.post('/api/chats/start', payload);
    const conversation = response?.data?.conversation;
    if (!conversation) {
      return null;
    }

    const normalized = normalizeConversation(conversation);
    const cached = getStoredConversations();
    const existingIndex = cached.findIndex((item) => String(item.id) === String(normalized.id));
    const updated = existingIndex === -1
      ? [normalized, ...cached]
      : cached.map((item) => (String(item.id) === String(normalized.id) ? normalized : item));

    setStoredConversations(updated);
    return normalized;
  },

  async getConversationById(id) {
    const conversations = await this.getAllConversations();
    return conversations.find((conversation) => String(conversation.id) === String(id)) || null;
  },

  async markConversationRead(conversationId) {
    try {
      await apiClient.patch(`/api/chats/${conversationId}/read`, {});
    } catch {
      // Keep local state update even if backend call fails.
    }

    const conversations = getStoredConversations();
    const updatedConversations = conversations.map((chat) => (
      String(chat.id) === String(conversationId)
        ? { ...chat, unreadCount: 0 }
        : chat
    ));

    setStoredConversations(updatedConversations, { emitEvent: false });
    return true;
  },

  async addMessage(conversationId, message) {
    const conversations = getStoredConversations();
    const conversation = conversations.find((chat) => String(chat.id) === String(conversationId));

    if (!conversation) {
      return null;
    }

    const newMessage = {
      ...message,
      id: String(Date.now()),
      timestamp: message.timestamp || new Date().toISOString()
    };

    try {
      const response = await apiClient.post(`/api/chats/${conversationId}/messages`, {
        text: message.text
      });
      const persistedMessage = response?.data?.message;
      if (persistedMessage) {
        const normalizedMessage = normalizeMessage(persistedMessage);
        const updatedConversations = conversations.map((chat) => (
          String(chat.id) === String(conversationId)
            ? { ...chat, messages: [...chat.messages, normalizedMessage], unreadCount: 0 }
            : chat
        ));
        setStoredConversations(updatedConversations);
        return normalizedMessage;
      }
    } catch {
      // If API call fails, persist the message locally.
    }

    const updatedConversations = conversations.map((chat) => (
      String(chat.id) === String(conversationId)
        ? { ...chat, messages: [...chat.messages, newMessage], unreadCount: 0 }
        : chat
    ));

    setStoredConversations(updatedConversations);
    return newMessage;
  }
};