// src/recruiters/recruiters.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('recruiters')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Get('talents')
  @Roles(Role.RECRUITER) 
  async listTalents() {
    return this.recruitersService.findAllDevs();
  }

  @Get('talents/:id')
  @Roles(Role.RECRUITER)
  async viewTalent(@Param('id') id: string) {
    return this.recruitersService.findDevById(id);
  }
}