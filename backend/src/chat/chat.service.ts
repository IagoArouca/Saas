import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    userId: string,
    userRole: string,
    content: string,
    conversationId?: string,
    receiverId?: string,
  ) {
    let finalConversationId = conversationId;
    if (!finalConversationId && receiverId) {
      if (userRole !== 'RECRUITER') {
        throw new ForbiddenException('Apenas recrutadores iniciam conversas.');
      }
      if (userId === receiverId) {
        throw new BadRequestException('Não é possível iniciar chat consigo mesmo.');
      }

      const existing = await this.prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { id: userId } } },
            { users: { some: { id: receiverId } } }
          ]
        }
      });

      if (existing) {
        finalConversationId = existing.id;
      } else {
        const newConv = await this.createConversation(userId, receiverId);
        finalConversationId = newConv.id;
      }
    }

    if (!finalConversationId) throw new BadRequestException('ID da conversa ausente.');

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: finalConversationId },
      include: { users: true }
    });

    if (!conversation) throw new NotFoundException('Conversa inexistente.');

    const receiver = conversation.users.find(u => u.id !== userId);
    if (!receiver) throw new NotFoundException('Destinatário não encontrado.');

    return this.prisma.message.create({
      data: {
        content,
        conversationId: finalConversationId,
        senderId: userId,
        receiverId: receiver.id,
      },
      include: {
        sender: { 
          select: { 
            id: true,
            email: true, 
            profile: { select: { avatar: true, username: true } } 
          } 
        }
      }
    });
  }

  async getMyConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { users: { some: { id: userId } } },
      include: {
        users: { 
          select: { 
            id: true, 
            email: true,
            profile: { select: { fullName: true, avatar: true, username: true } } 
          } 
        },
        messages: { 
          orderBy: { createdAt: 'asc' }, 
          take: 50 
        }
      },
      orderBy: { createdAt: 'desc' } 
    });
  }

  async createConversation(userId: string, receiverId: string) {
    return this.prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: userId }, { id: receiverId }]
        }
      }
    });
  }
}