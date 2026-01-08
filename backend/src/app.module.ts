import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProjectsModule } from './projects/projects.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RecruitersModule } from './recruiters/recruiters.module';
import { ChatModule } from './chat/chat.module';
import { ProductivityModule } from './productivity/productivity.module';
import { CreatorsModule } from './creators/creators.module';
import { ToolsModule } from './tools/tools.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    ProfilesModule, 
    ProjectsModule, 
    ScheduleModule, 
    RecruitersModule, 
    ChatModule, 
    ProductivityModule, 
    CreatorsModule, 
    ToolsModule, 
    AnalyticsModule, StudyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}