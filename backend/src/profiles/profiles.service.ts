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

    // 1. Busca o usuário para verificar o Role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Helper para formatar campos que vêm como string ou array do front
    const formatArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map(i => i.trim()).filter(i => i !== "");
      return [];
    };

    // 2. Validação de Username Único (Check em ambas as tabelas)
    if (data.username) {
      const usernameLower = data.username.toLowerCase().trim();
      
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

    // 3. Lógica específica para RECRUITER
    if (user.role === 'RECRUITER') {
      const recruiterData = {
        username: data.username, // CRUCIAL: Agora incluído no objeto de dados
        fullName: data.fullName,
        bio: data.bio,
        companyName: data.companyName,
        companySize: data.companySize,
        location: data.location,
        linkedinUrl: data.linkedinUrl,
        websiteUrl: data.websiteUrl,
        companyValues: data.companyValues,
        hiringProcess: data.hiringProcess,
        role: data.role,
        technologies: formatArray(data.technologies),
        benefits: formatArray(data.benefits),
        openPositions: data.openPositions || [], 
        experienceYears: Number(data.experienceYears) || 0,
        hiringStats_count: Number(data.hiringStats_count) || 0,
        hiringStats_projects: Number(data.hiringStats_projects) || 0,
        hiringStats_time: Number(data.hiringStats_time) || 0,
        avatar: data.avatar,
        bannerUrl: data.bannerUrl,
      };

      return this.prisma.recruiterProfile.upsert({
        where: { userId },
        update: recruiterData, // Atualiza se existir
        create: { 
          ...recruiterData, 
          userId,
          username: data.username || `recruiter_${userId.slice(0, 5)}`
        },
      });
    }

    // 4. Lógica para DEV (Profile padrão)
    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        username: data.username, // Garante que o username atualize aqui também
        technologies: formatArray(data.technologies)
      },
    });
  }

  /**
   * Busca o perfil completo (Me) com base no Role
   */
  async getByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, recruiterProfile: true }
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');
    
    // Retorna o perfil correto dependendo do tipo de conta
    const profile = user.role === 'RECRUITER' ? user.recruiterProfile : user.profile;
    
    if (!profile) return { role: user.role, userId: user.id };
    return { ...profile, role: user.role };
  }

  /**
   * Atualiza apenas o Avatar
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
   * Atualiza apenas o Banner
   */
  async updateBanner(userId: string, bannerUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.role === 'RECRUITER') {
      return this.prisma.recruiterProfile.upsert({
        where: { userId },
        update: { bannerUrl: bannerUrl },
        create: { 
          userId, 
          bannerUrl: bannerUrl, 
          username: `recruiter_${userId.slice(0, 5)}` 
        }
      });
    }

    return this.prisma.profile.update({
      where: { userId },
      data: { bannerUrl: bannerUrl }
    });
  }

  /**
   * Busca Perfil Público por Username (Slug)
   */
  async findPublicProfile(username: string, ip: string) {
    // Tenta encontrar como Recrutador primeiro
    const recruiter = await this.prisma.recruiterProfile.findUnique({
      where: { username },
      include: { user: true }
    });

    if (recruiter) {
      return { ...recruiter, type: 'RECRUITER' };
    }

    // Se não for recrutador, busca como Dev
    const dev = await this.prisma.profile.findUnique({
      where: { username },
      include: { user: { include: { projects: true } } }
    });

    if (!dev) throw new NotFoundException('Perfil não encontrado');

    // Registra a visita (opcional)
    this.prisma.profileVisit.create({
      data: { profileId: dev.id, ip: ip || 'unknown' }
    }).catch(() => null);

    return { ...dev, projects: dev.user?.projects || [], type: 'DEV' };
  }
}