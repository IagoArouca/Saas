import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  UnauthorizedException 
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('block')
  async addBlock(@Request() req: any, @Body() data: any) {
    // A sua JwtStrategy retorna 'id', então acessamos via req.user.id
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedException('Usuário não identificado no token JWT');
    }

    return this.scheduleService.addBlock(userId, data);
  }

  @Get('my-schedule')
  async getMySchedule(@Request() req: any) {
    return this.scheduleService.getMySchedule(req.user.id);
  }

  @Delete('block/:id')
  async removeBlock(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.removeBlock(id, req.user.id);
  }
}