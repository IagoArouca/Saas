import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('analytics')
@UseGuards(JwtAuthGuard) 
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('profile-views')
  async getProfileViews(@Request() req) {

    const userId = req.user.id;

    return this.analyticsService.getProfileStats(userId);
  }
}