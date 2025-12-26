import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) {}

    async addBlock(userId: string, data: any) {
        return this.prisma.studySchedule.create({
            data: { ...data, userId}
        });
    }

    async getMySchedule(userId: string) {
        return this.prisma.studySchedule.findMany({
            where: { userId},
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
    }

    async removeBlock(blockId: string, userId: string ) {
        const block = await this.prisma.studySchedule.findUnique({ where: { id: blockId } });
        if (!block || block.userId !== userId) throw new Error('Acesso negado');

        return this.prisma.studySchedule.delete({ where: { id: blockId } });
    }
}
