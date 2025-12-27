import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { NotificationsModule } from '../notifications/notifications.module'; 
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  imports: [NotificationsModule], 
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}
