import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post('send')
  async send(
    @Request() req: any,
    @Body() body: {
      conversationId?: string;
      receiverId?: string;
      content: string;
    },
  ) {
    return this.chatService.sendMessage(
      req.user.id,
      req.user.role,
      body.content,
      body.conversationId,
      body.receiverId,
    );
  }
  @Get('my-chats')
  async getMyChats(@Request() req: any) {
    return this.chatService.getMyConversations(req.user.id);
  }
  @Post('initiate')
  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER)
  async initiate(
    @Request() req: any,
    @Body() body: { devId: string },
  ) {
    return this.chatService.createConversation(req.user.id, body.devId);
  }
}