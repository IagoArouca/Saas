import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAllMine(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // MÉTODO ATUALIZADO: Toggle Highlight
  async toggleHighlight(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ 
      where: { id: projectId } 
    });

    if (!project) throw new NotFoundException('Projeto não encontrado');
    if (project.userId !== userId) throw new ForbiddenException('Você não tem permissão');

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        isHighlighted: !project.isHighlighted, // Inverte o valor (true -> false / false -> true)
      },
    });
  }

  async update(projectId: string, userId: string, data: any) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project) throw new NotFoundException('Projeto não encontrado');
    if (project.userId !== userId) throw new ForbiddenException('Você não tem permissão');

    return this.prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  async remove(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project) throw new NotFoundException('Projeto não encontrado');
    if (project.userId !== userId) throw new ForbiddenException('Ação não permitida');

    return this.prisma.project.delete({ where: { id: projectId } });
  }

  async explore(tech?: string) {
    return this.prisma.project.findMany({
      where: tech ? {
        technologies: {
          has: tech 
        }
      } : {},
      include: {
        user: {
          include: {
            profile: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}