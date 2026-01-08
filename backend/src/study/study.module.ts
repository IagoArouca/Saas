import { Module } from '@nestjs/common';
import { StudyTrackService } from './study.service'; 
import { StudyTrackController } from './study.controller'; 
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  controllers: [StudyTrackController],
  providers: [StudyTrackService, PrismaService],
  exports: [StudyTrackService] 
})
export class StudyModule {}