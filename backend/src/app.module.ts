import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Importe o ConfigModule
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

@Module({
  imports: [
    // 2. Adicione o ConfigModule como o PRIMEIRO item do array de imports
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente disponíveis em todos os módulos
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
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}