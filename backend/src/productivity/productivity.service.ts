// src/productivity/productivity.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductivityService {
  constructor(private prisma: PrismaService) {}

  async logSession(userId: string, duration: number, subject?: string) {
    return this.prisma.focusSession.create({
      data: {
        userId,
        duration,
        subject,
      },
    });
  }

  async getDailyStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await this.prisma.focusSession.findMany({
      where: {
        userId,
        createdAt: { gte: today },
      },
    });

    const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
    
    return {
      count: sessions.length,
      totalMinutes,
      sessions,
    };
  }
}