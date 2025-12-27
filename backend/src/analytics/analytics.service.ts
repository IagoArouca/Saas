import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, format } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getProfileStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return { total: 0, chartData: [] };

    const sevenDaysAgo = subDays(new Date(), 7);

    const visits = await this.prisma.profileVisit.findMany({
      where: {
        profileId: profile.id,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'asc' }
    });

    const statsMap = new Map();
    visits.forEach(v => {
      const dateKey = format(v.createdAt, 'dd/MM');
      statsMap.set(dateKey, (statsMap.get(dateKey) || 0) + 1);
    });
    const chartData: { name: string; views: number }[] = [];

      for (let i = 6; i >= 0; i--) {
        const dateLabel = format(subDays(new Date(), i), 'dd/MM');
        chartData.push({
          name: dateLabel, 
          views: statsMap.get(dateLabel) || 0,
        });
      }

    return {
      total: visits.length,
      chartData,
    };
  }
}