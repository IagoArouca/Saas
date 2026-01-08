import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruitersService {
  constructor(private prisma: PrismaService) {}
  async findAllDevs() {
    return this.prisma.user.findMany({
      where: { 
        role: 'DEV' 
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            fullName: true,
            avatar: true,
            bio: true,
            level: true,
            technologies: true,
            username: true,
          }
        },
        projects: {
          select: {
            id: true,
            title: true,
            imageUrl: true, 
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  async findDevById(devId: string) {
    const dev = await this.prisma.user.findUnique({
      where: { 
        id: devId, 
        role: 'DEV' 
      },
      include: {
        profile: true,
        projects: {
          orderBy: {
            createdAt: 'desc'
          }
        },
      }
    });

    if (!dev) {
      throw new NotFoundException('Desenvolvedor não encontrado ou não possui perfil de talento.');
    }

    return dev;
  }
}