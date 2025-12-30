import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,    
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Atualiza o perfil do usuário.
   * O objeto 'data' pode conter: fullName, bio, role, level, avatar, bannerUrl, etc.
   */
  async update(userId: string, data: any) {
    if (data.username) {
      const usernameLower = data.username.toLowerCase();

      const existing = await this.prisma.profile.findFirst({
        where: { 
          username: usernameLower,
          NOT: { userId },
        },
      });

      if (existing) {
        throw new BadRequestException('Este username já está em uso.');
      }

      data.username = usernameLower;
    }

    // O Prisma salva role e level automaticamente se os nomes baterem com o Schema
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async getByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            role: true, // Enum de permissão (DEV, RECRUITER...)
          },
        },
      },
    });
  }

  async findPublicProfile(username: string, ip: string) {
    // Buscamos o perfil incluindo os campos role e level que adicionamos ao Prisma
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: {
        user: { 
          select: { 
            role: true, 
            projects: {
              orderBy: { createdAt: 'desc' } // Opcional: ordena os projetos
            } 
          } 
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil @${username} não encontrado`);
    }

    // Registro de visita em background para métricas
    this.prisma.profileVisit
      .create({
        data: {
          profileId: profile.id,
          ip: ip || 'unknown',
        },
      })
      .catch((e) => console.error('Erro ao registrar visita:', e));

    /**
     * Retorno formatado para o Frontend:
     * - O spread ...profile já traz role e level do banco.
     * - Extraímos os projetos do objeto user para a raiz.
     */
    return {
      ...profile,
      projects: (profile.user as any)?.projects || []
    };
  }
}