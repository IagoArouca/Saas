import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async addBlock(userId: string, data: any) {
    const existingBlock = await this.prisma.studySchedule.findFirst({
      where: {
        userId: userId,
        dayOfWeek: Number(data.dayOfWeek),
      },
    });

    if (existingBlock) {
      return this.prisma.studySchedule.update({
        where: { id: existingBlock.id },
        data: {
          subject: data.subject,
          startTime: data.startTime || '00:00',
          endTime: data.endTime || '00:00',
        },
      });
    }
    return this.prisma.studySchedule.create({
      data: {
        dayOfWeek: Number(data.dayOfWeek),
        subject: data.subject,
        startTime: data.startTime || '00:00',
        endTime: data.endTime || '00:00',
        user: {
          connect: { id: userId } 
        }
      },
    });
  }

  async getMySchedule(userId: string) {
    return this.prisma.studySchedule.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' }, 
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