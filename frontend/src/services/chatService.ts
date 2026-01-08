import api from './api';

export const chatService = {
  sendMessage: (data: {
    content: string;
    conversationId?: string;
    receiverId?: string;
  }) => {
    return api.post('/chat/send', data);
  },

  getMyChats: () => {
    return api.get('/chat/my-chats');
  },
};