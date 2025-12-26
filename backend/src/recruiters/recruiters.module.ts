import { Module } from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { RecruitersController } from './recruiters.controller';

@Module({
  providers: [RecruitersService],
  controllers: [RecruitersController]
})
export class RecruitersModule {}
