export const mockConversations = [
  {
    id: 1,
    // The person you are talking to
    participant: { 
      id: 1, 
      name: 'John Doe', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' 
    },
    product: {
        id: 1,
        title: 'MacBook Air M1',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    },
    messages: [
      { id: 1, senderId: 'me', text: 'Hi, is the laptop still available?', timestamp: '2024-06-01T10:00:00Z' },
      { id: 2, senderId: 1, text: 'Yes, it is!', timestamp: '2024-06-01T10:05:00Z' },
      { id: 3, senderId: 'me', text: 'Great! Can I check it out near the library tomorrow?', timestamp: '2024-06-01T10:10:00Z' },
      { id: 4, senderId: 1, text: 'Sure, 5 PM works for me.', timestamp: '2024-06-01T10:15:00Z' },
    ],
  }
];