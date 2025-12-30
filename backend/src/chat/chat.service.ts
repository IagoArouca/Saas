import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Prisma } from '@prisma/client';

/**
 * Tipo forte para conversa com relações carregadas
 */
type ConversationWithRelations =
  Prisma.ConversationGetPayload<{
    include: {
      users: {
        include: {
          profile: true;
        };
      };
      messages: true;
    };
  }>;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * 🔹 Criar conversa entre recrutador e dev
   */
  async createConversation(recruiterId: string, devId: string) {
    const existingConversation =
      await this.prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { id: recruiterId } } },
            { users: { some: { id: devId } } },
          ],
        },
      });

    if (existingConversation) {
      return existingConversation;
    }

    return this.prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: recruiterId }, { id: devId }],
        },
      },
    });
  }

  /**
   * 🔹 Enviar mensagem
   */
  async sendMessage(
    userId: string,
    userRole: string,
    conversationId: string,
    content: string,
  ) {
    const conversation =
      (await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          users: {
            include: {
              profile: true,
            },
          },
          messages: true,
        },
      })) as ConversationWithRelations | null;

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const isParticipant = conversation.users.some(
      (user) => user.id === userId,
    );

    if (!isParticipant) {
      throw new ForbiddenException(
        'Você não faz parte desta conversa',
      );
    }

    // 🔒 Regra: apenas recrutador pode iniciar conversa
    if (
      conversation.messages.length === 0 &&
      userRole !== 'RECRUITER'
    ) {
      throw new ForbiddenException(
        'Apenas recrutadores podem iniciar uma nova conversa',
      );
    }

    const sender = conversation.users.find(
      (user) => user.id === userId,
    );

    if (!sender) {
      throw new ForbiddenException(
        'Remetente não encontrado na conversa',
      );
    }

    const receiver = conversation.users.find(
      (user) => user.id !== userId,
    );

    if (!receiver) {
      throw new NotFoundException(
        'Destinatário não encontrado',
      );
    }

    const message = await this.prisma.message.create({
      data: {
        content,
        conversationId,
        senderId: sender.id,
        receiverId: receiver.id,
      },
    });

    // 🔔 Notificação em tempo real (Socket.IO)
    if (this.notificationsGateway.server) {
      this.notificationsGateway.server
        .to(receiver.id)
        .emit('newMessage', {
          conversationId,
          content,
          senderName:
            sender.profile?.fullName || 'Usuário da Mochila',
        });
    }

    return message;
  }

  /**
   * 🔹 Buscar conversas do usuário logado
   */
  async getMyConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 1, // última mensagem
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
