import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,    
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Atualiza ou Cria o perfil dependendo do Role do usuário
   */
  async update(userId: string, data: any) {
    if (!userId) throw new BadRequestException('ID do usuário é obrigatório');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Validação de Username único em ambas as tabelas
    if (data.username) {
      const usernameLower = data.username.toLowerCase();
      const existingDev = await this.prisma.profile.findFirst({
        where: { username: usernameLower, NOT: { userId } },
      });
      const existingRecruiter = await this.prisma.recruiterProfile.findFirst({
        where: { username: usernameLower, NOT: { userId } },
      });

      if (existingDev || existingRecruiter) {
        throw new BadRequestException('Este username já está em uso.');
      }
      data.username = usernameLower;
    }

    // LÓGICA PARA RECRUTADOR
    if (user.role === 'RECRUITER') {
      const recruiterData = {
        ...data,
        // Garante que tecnologias e benefícios sejam salvos como Array
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        // Conversão rigorosa de tipos numéricos para evitar Erro 500
        experienceYears: data.experienceYears ? Number(data.experienceYears) : 0,
        hiringStats_count: data.hiringStats_count ? Number(data.hiringStats_count) : 0,
        hiringStats_projects: data.hiringStats_projects ? Number(data.hiringStats_projects) : 0,
        hiringStats_time: data.hiringStats_time ? Number(data.hiringStats_time) : 0,
      };

      return this.prisma.recruiterProfile.upsert({
        where: { userId },
        update: recruiterData,
        create: { ...recruiterData, userId },
      });
    }

    // LÓGICA PARA DEV
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  /**
   * Atualização de Avatar com Type Guard
   */
  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.role === 'RECRUITER') {
      return this.prisma.recruiterProfile.upsert({
        where: { userId },
        update: { avatar: avatarUrl },
        create: { 
          userId, 
          avatar: avatarUrl, 
          username: `recruiter_${userId.slice(0, 5)}` 
        }
      });
    }

    return this.prisma.profile.update({
      where: { userId },
      data: { avatar: avatarUrl }
    });
  }

  /**
   * Atualização de Banner com Type Guard
   */
  async updateBanner(userId: string, bannerUrl: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('Usuário não encontrado');

  if (user.role === 'RECRUITER') {
    return this.prisma.recruiterProfile.upsert({
      where: { userId },
      update: { bannerUrl: bannerUrl }, // Certifique-se que o nome bate com o Prisma
      create: { 
        userId, 
        bannerUrl: bannerUrl, 
        username: `recruiter_${userId.slice(0, 5)}` 
      }
    });
  }

  // Se for DEV
  return this.prisma.profile.update({
    where: { userId },
    data: { bannerUrl: bannerUrl }
  });
}

  /**
   * Busca o perfil do usuário logado (usado no Settings)
   */
  async getByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        recruiterProfile: true,
      }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const profile = user.role === 'RECRUITER' ? user.recruiterProfile : user.profile;
    
    // Se o perfil ainda não existir, retornamos o básico para não quebrar o Front
    if (!profile) {
       return { role: user.role, userId: user.id };
    }

    return { ...profile, role: user.role };
  }

  /**
   * Busca perfil público (Username em qualquer tabela)
   */
  async findPublicProfile(username: string, ip: string) {
    // Procura primeiro em Recrutadores
    let profile: any = await this.prisma.recruiterProfile.findUnique({
      where: { username },
      include: { user: true }
    });

    // Se não for recrutador, busca em Devs
    if (!profile) {
      profile = await this.prisma.profile.findUnique({
        where: { username },
        include: { user: { include: { projects: true } } }
      });
    }

    if (!profile) throw new NotFoundException(`@${username} não encontrado`);

    // Log de visita
    this.prisma.profileVisit.create({
      data: { profileId: profile.id, ip: ip || 'unknown' }
    }).catch(() => null);

    return {
      ...profile,
      projects: profile.user?.projects || []
    };
  }
}