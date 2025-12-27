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

    // Busca todas as visitas da última semana
    const visits = await this.prisma.profileVisit.findMany({
      where: {
        profileId: profile.id,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'asc' }
    });

    // Agrupa visitas por dia
    const statsMap = new Map();
    visits.forEach(v => {
      const dateKey = format(v.createdAt, 'dd/MM');
      statsMap.set(dateKey, (statsMap.get(dateKey) || 0) + 1);
    });

    // Monta o array final garantindo que todos os 7 dias apareçam (mesmo com 0)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const dateLabel = format(subDays(new Date(), i), 'dd/MM');
      chartData.push({
        name: dateLabel, // Nome para o eixo X do gráfico
        views: statsMap.get(dateLabel) || 0,
      });
    }

    return {
      total: visits.length,
      chartData,
    };
  }
}