import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StudyTrackService } from './study.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Delete('tracks/:id')
  deleteTrack(@Param('id') id: string) {
    return this.studyService.deleteTrack(id);
  }

  @Patch('modules/:id/toggle')
  toggleModule(@Param('id') id: string) {
    return this.studyService.toggleModule(id);
  }

  @Patch('modules/:id')
  updateModule(@Param('id') id: string, @Body('title') title: string) {
    return this.studyService.updateModule(id, title);
  }

  @Delete('modules/:id')
  deleteModule(@Param('id') id: string) {
    return this.studyService.deleteModule(id);
  }

  @Post('tracks/:id/modules')
  addModule(@Param('id') id: string, @Body('title') title: string) {
    return this.studyService.addModuleToTrack(id, title);
  }
}