import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StudyTrackService } from './study.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Ajuste o caminho conforme seu projeto

@Controller('study')
@UseGuards(JwtAuthGuard)
export class StudyTrackController {
  constructor(private readonly studyService: StudyTrackService) {}

  @Get('tracks')
  findAll(@Request() req) {
    return this.studyService.findAll(req.user.id);
  }

  @Post('tracks')
  create(@Request() req, @Body() data: { title: string; level: string; modules: string[] }) {
    return this.studyService.create(req.user.id, data);
  }

  @Patch('modules/:id/toggle')
  toggleModule(@Param('id') id: string) {
    return this.studyService.toggleModule(id);
  }
}