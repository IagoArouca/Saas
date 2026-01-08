import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ROADMAPS_PADRAO = [
  {
    title: "Engenharia de Software: Roadmap para Júnior",
    level: "Júnior",
    modules: [
      "Fundamentos: Lógica de Programação e Algoritmos",
      "Versionamento: Git Flow e Conventional Commits",
      "Web Basics: HTML5 Semântico e CSS Moderno",
      "JavaScript: ES6+, Async/Await e Manipulação de DOM",
      "React: Hooks Básicos (useState, useEffect)",
      "API: Consumo de REST APIs com Axios/Fetch",
      "CSS Frameworks: Tailwind CSS",
      "Soft Skills: Metodologias Ágeis (Scrum/Kanban)"
    ]
  },
  {
    title: "Engenharia de Software: Roadmap Júnior para Pleno",
    level: "Pleno",
    modules: [
      "Clean Code: Nomenclatura, Funções e Comentários",
      "SOLID: Princípios de Design de Software",
      "Arquitetura: Injeção de Dependência e NestJS",
      "Banco de Dados: Relacionamentos e Indexação com Prisma",
      "Segurança: JWT, Refresh Tokens e Roles",
      "Testes: Unitários com Jest",
      "Infra: Docker e Docker Compose",
      "Mensageria: Redis e Filas (BullMQ)"
    ]
  }
];

@Injectable()
export class StudyTrackService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const tracks = await this.prisma.studyTrack.findMany({
      where: { userId },
      include: { 
        modules: { orderBy: { order: 'asc' } } 
      },
      orderBy: { createdAt: 'desc' },
    });

    if (tracks.length === 0) {
      const createdTracks = await Promise.all(
        ROADMAPS_PADRAO.map(roadmap => this.create(userId, roadmap))
      );
      return createdTracks;
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

  async deleteTrack(trackId: string) {
    return this.prisma.studyTrack.delete({
      where: { id: trackId }
    });
  }

  async toggleModule(moduleId: string) {
    const studyModule = await this.prisma.studyModule.findUnique({ where: { id: moduleId } });
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

  async addModuleToTrack(trackId: string, title: string) {
    const lastModule = await this.prisma.studyModule.findFirst({
      where: { trackId },
      orderBy: { order: 'desc' }
    });

    return this.prisma.studyModule.create({
      data: {
        title,
        order: lastModule ? lastModule.order + 1 : 0,
        trackId
      }
    });
  }
}