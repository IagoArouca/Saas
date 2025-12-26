import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProjectsModule } from './projects/projects.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RecruitersModule } from './recruiters/recruiters.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProfilesModule, ProjectsModule, ScheduleModule, RecruitersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
