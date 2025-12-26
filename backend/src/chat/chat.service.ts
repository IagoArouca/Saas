import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(recruiterId: string, devId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        participants: { every: { id: { in: [recruiterId, devId] } } }
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

  async sendMessage(userId: string, userRole: Role, conversationId: string, content: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }
    });

    if (!conversation) throw new NotFoundException('Conversa não encontrada');

    const isParticipant = conversation.participants.some(p => p.id === userId);
    if (!isParticipant) throw new ForbiddenException('Não fazes parte desta conversa');

    return this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: userId,
        receiverId: conversation.participants.find(p => p.id !== userId).id
      }
    });
  }

  async getMyConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { id: userId } } },
      include: { 
        messages: { take: 1, orderBy: { createdAt: 'desc' } }, // Última mensagem
        participants: { select: { email: true, role: true, profile: { select: { avatar: true } } } }
      }
    });
  }
}