import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
