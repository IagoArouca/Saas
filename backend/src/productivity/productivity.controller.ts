import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ProductivityService } from './productivity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('productivity')
@UseGuards(JwtAuthGuard)
export class ProductivityController {
  constructor(private readonly productivityService: ProductivityService) {}

  @Post('log-session')
  async log(@Request() req: any, @Body() body: { duration: number, subject?: string }) {
    return this.productivityService.logSession(req.user.userId, body.duration, body.subject);
  }

  @Get('stats/today')
  async getStats(@Request() req: any) {
    return this.productivityService.getDailyStats(req.user.userId);
  }
}