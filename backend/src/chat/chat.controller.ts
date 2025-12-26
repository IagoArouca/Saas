import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('initiate')
  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER)
  async initiate(@Request() req: any, @Body() body: { devId: string }) {
    return this.chatService.createConversation(req.user.userId, body.devId);
  }

  @Post('send')
  async send(@Request() req: any, @Body() body: { conversationId: string, content: string }) {
    return this.chatService.sendMessage(
      req.user.userId, 
      req.user.role, 
      body.conversationId, 
      body.content
    );
  }

  @Get('my-chats')
  async getMyChats(@Request() req: any) {
    return this.chatService.getMyConversations(req.user.userId);
  }
}