// backend/src/chat/chat.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway
  ) {}

  async createConversation(recruiterId: string, devId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: recruiterId } } },
          { participants: { some: { id: devId } } }
        ]
      }
    });

    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: recruiterId }, { id: devId }]
        }
      }
    });
  }

  async sendMessage(userId: string, userRole: string, conversationId: string, content: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        participants: { include: { profile: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } } 
      }
    });

    if (!conversation) throw new NotFoundException('Conversa não encontrada');

    const isParticipant = conversation.participants.some(p => p.id === userId);
    if (!isParticipant) throw new ForbiddenException('Você não faz parte desta conversa');

    if (conversation.messages.length === 0 && userRole !== 'RECRUITER') {
      throw new ForbiddenException('Apenas recrutadores podem iniciar uma nova conversa.');
    }

    const receiver = conversation.participants.find(p => p.id !== userId);
    const sender = conversation.participants.find(p => p.id === userId);

    const message = await this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId,
        receiverId: receiver.id
      }
    });

    // Emissão via Socket.io para tempo real
    if (this.notificationsGateway.server) {
      this.notificationsGateway.server.to(receiver.id).emit('newMessage', {
        senderName: sender.profile?.fullName || 'Usuário da Mochila',
        content: content,
        conversationId: conversationId
      });
    }

    return message;
  }

  async getMyConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { 
        participants: { some: { id: userId } } 
      },
      include: { 
        messages: { 
          take: 1, 
          orderBy: { createdAt: 'desc' } 
        },
        participants: { 
          select: { 
            id: true,
            email: true, 
            role: true, 
            profile: { select: { fullName: true, avatar: true } } 
          } 
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }
}