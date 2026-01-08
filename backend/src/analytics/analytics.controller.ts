import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('analytics')
@UseGuards(JwtAuthGuard) 
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('profile-views')
  async getProfileViews(@Request() req: any) {
    const userId = req.user.id;

    if (!userId) {
      throw new Error("Usuário não identificado");
    }

    return this.analyticsService.getProfileStats(userId);
  }
}