import api from './api';

export const chatService = {
  // Envia mensagem (Se for a primeira, envia receiverId. Se já existir, envia conversationId)
  sendMessage: (data: {
    content: string;
    conversationId?: string;
    receiverId?: string;
  }) => {
    return api.post('/chat/send', data);
  },

  // Busca todas as conversas que o usuário logado possui
  getMyChats: () => {
    return api.get('/chat/my-chats');
  },
};