import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MASTER_ROADMAP = {
  title: "Engenharia de Software: Roadmap Júnior para Pleno",
  level: "Pleno",
  modules: [
    "Clean Code: Nomenclatura, Funções e Comentários",
    "SOLID: Princípio de Responsabilidade Única (SRP)",
    "Arquitetura: Injeção de Dependência no NestJS",
    "Banco de Dados: Relacionamentos e Indexação com Prisma",
    "Segurança: Implementação de JWT e Refresh Token",
    "Testes: Unitários com Jest (TDD Básico)",
    "Infra: Dockerização e Docker Compose",
    "Mensageria: Filas e Background Jobs (Redis)",
    "Soft Skills: Escrita de PRs e Code Review"
  ]
};

@Injectable()
export class StudyTrackService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const tracks = await this.prisma.studyTrack.findMany({
      where: { userId },
      include: { 
        modules: { 
          orderBy: { order: 'asc' } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    // Se estiver vazio, cria automaticamente a trilha padrão para o Dev
    if (tracks.length === 0) {
      const defaultTrack = await this.create(userId, MASTER_ROADMAP);
      return [defaultTrack];
    }

    return tracks;
  }

  async create(userId: string, data: { title: string; level: string; modules: string[] }) {
    return this.prisma.studyTrack.create({
      data: {
        title: data.title,
        level: data.level,
        userId,
        modules: {
          create: data.modules.map((m, index) => ({
            title: m,
            order: index,
          })),
        },
      },
      include: { modules: true },
    });
  }

  async toggleModule(moduleId: string) {
    const studyModule = await this.prisma.studyModule.findUnique({ 
      where: { id: moduleId } 
    });
    
    if (!studyModule) throw new NotFoundException('Módulo não encontrado');

    return this.prisma.studyModule.update({
      where: { id: moduleId },
      data: { isCompleted: !studyModule.isCompleted },
    });
  }

  async updateModule(moduleId: string, title: string) {
    return this.prisma.studyModule.update({
      where: { id: moduleId },
      data: { title }
    });
  }

  async deleteModule(moduleId: string) {
    return this.prisma.studyModule.delete({ 
      where: { id: moduleId } 
    });
  }

  async deleteTrack(trackId: string) {
    return this.prisma.studyTrack.delete({ 
      where: { id: trackId } 
    });
  }

  async addModuleToTrack(trackId: string, title: string) {
    const lastModule = await this.prisma.studyModule.findFirst({
      where: { trackId: trackId }, // Ajustado para 'trackId' conforme seu schema
      orderBy: { order: 'desc' }
    });

    return this.prisma.studyModule.create({
      data: {
        title,
        order: lastModule ? lastModule.order + 1 : 0,
        trackId: trackId // Ajustado para 'trackId' conforme seu schema
      }
    });
  }
}