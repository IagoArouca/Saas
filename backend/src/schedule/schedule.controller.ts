import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('schedule')
@UseGuards(JwtAuthGuard) // Protege todas as rotas: precisa estar logado
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // Rota para adicionar um novo bloco de estudo
  @Post('block')
  async addBlock(@Request() req: any, @Body() data: any) {
    // O userId vem do token JWT (req.user) para segurança
    return this.scheduleService.addBlock(req.user.userId, data);
  }

  // Rota para buscar todo o cronograma do usuário logado
  @Get('my-schedule')
  async getMySchedule(@Request() req: any) {
    return this.scheduleService.getMySchedule(req.user.userId);
  }

  // Rota para remover um bloco específico pelo ID
  @Delete('block/:id')
  async removeBlock(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.removeBlock(id, req.user.userId);
  }
}