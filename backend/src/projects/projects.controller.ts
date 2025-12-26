import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard) 
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.projectsService.create(req.user.userId, body);
  }

  @Get('my-projects')
  findAll(@Request() req: any) {
    return this.projectsService.findAllMine(req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.projectsService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.remove(id, req.user.userId);
  }
}