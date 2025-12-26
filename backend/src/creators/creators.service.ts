import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private prisma: PrismaService) {}

  async addVideo(creatorId: string, data: { title: string, videoUrl: string, thumbnail?: string }) {
    return this.prisma.videoContent.create({
      data: {
        ...data,
        creatorId,
      },
    });
  }

  async getMyVideos(creatorId: string) {
    return this.prisma.videoContent.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeVideo(videoId: string, creatorId: string) {
    const video = await this.prisma.videoContent.findUnique({ where: { id: videoId } });
    
    if (!video || video.creatorId !== creatorId) {
      throw new ForbiddenException('Ação não permitida para este conteúdo.');
    }

    return this.prisma.videoContent.delete({ where: { id: videoId } });
  }
}