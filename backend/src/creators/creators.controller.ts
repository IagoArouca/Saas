import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('creators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post('video')
  @Roles(Role.CONTENT_CREATOR) 
  async upload(@Request() req: any, @Body() body: any) {
    return this.creatorsService.addVideo(req.user.userId, body);
  }

  @Get('my-content')
  @Roles(Role.CONTENT_CREATOR)
  async list(@Request() req: any) {
    return this.creatorsService.getMyVideos(req.user.userId);
  }

  @Delete('video/:id')
  @Roles(Role.CONTENT_CREATOR)
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.creatorsService.removeVideo(id, req.user.userId);
  }
}