import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private prisma: PrismaService) {}

  async addVideo(userId: string, data: { title: string, videoUrl: string, thumbnail?: string }) {
    return this.prisma.videoContent.create({
      data: {
        ...data,
        creatorId: userId,
      },
    });
  }

  async getMyVideos(userId: string) {
    return this.prisma.videoContent.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeVideo(videoId: string, userId: string) {
    const video = await this.prisma.videoContent.findUnique({ 
      where: { id: videoId } 
    });
    
    if (!video) throw new NotFoundException('Vídeo não encontrado.');
    if (video.creatorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este conteúdo.');
    }

    return this.prisma.videoContent.delete({ where: { id: videoId } });
  }
}