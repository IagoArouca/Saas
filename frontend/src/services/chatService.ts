import api from './api';

export const chatService = {
  getOrCreateConversation: (userId: string) => {
    return api.post('/chat/conversations', { participantId: userId });
  },
  
  getMessages: (conversationId: string) => {
    return api.get(`/chat/conversations/${conversationId}/messages`);
  }
};