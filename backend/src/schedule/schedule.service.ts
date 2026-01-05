import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async addBlock(userId: string, data: any) {
    // 1. Procurar se já existe um bloco para este dia da semana para este usuário específico
    const existingBlock = await this.prisma.studySchedule.findFirst({
      where: {
        userId: userId,
        dayOfWeek: Number(data.dayOfWeek), // Garante que seja um número
      },
    });

    if (existingBlock) {
      // 2. Se já existir, apenas atualizamos o conteúdo (subject)
      return this.prisma.studySchedule.update({
        where: { id: existingBlock.id },
        data: {
          subject: data.subject,
          startTime: data.startTime || '00:00',
          endTime: data.endTime || '00:00',
        },
      });
    }

    // 3. Se não existir, criamos um novo vinculando ao usuário
    return this.prisma.studySchedule.create({
      data: {
        dayOfWeek: Number(data.dayOfWeek),
        subject: data.subject,
        startTime: data.startTime || '00:00',
        endTime: data.endTime || '00:00',
        user: {
          connect: { id: userId } // Conecta o bloco ao ID do usuário do token
        }
      },
    });
  }

  async getMySchedule(userId: string) {
    return this.prisma.studySchedule.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' }, // Retorna ordenado (Segunda, Terça...)
    });
  }

  async removeBlock(blockId: string, userId: string) {
    const block = await this.prisma.studySchedule.findUnique({
      where: { id: blockId },
    });

    if (!block) throw new NotFoundException('Bloco não encontrado');
    if (block.userId !== userId) throw new ForbiddenException('Acesso negado');

    return this.prisma.studySchedule.delete({
      where: { id: blockId },
    });
  }
}