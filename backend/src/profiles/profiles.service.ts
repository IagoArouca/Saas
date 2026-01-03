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
   * Atualiza o perfil do usuário.
   */
  async update(userId: string, data: any) {
    if (!userId) throw new BadRequestException('ID do usuário é obrigatório');

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

    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  /**
   * Busca o perfil pelo ID do usuário (Conta)
   */
  async getByUserId(userId: string) {
    if (!userId) throw new BadRequestException('ID do usuário inválido');

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  /**
   * Busca o perfil público pelo username
   */
  async findPublicProfile(username: string, ip: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: {
        user: { 
          select: { 
            role: true, 
            // Buscamos os projetos que pertencem ao usuário deste perfil
            projects: {
              orderBy: { createdAt: 'desc' }
            } 
          } 
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Perfil @${username} não encontrado`);
    }

    // Registro de visita (sem travar a resposta principal)
    this.prisma.profileVisit
      .create({
        data: {
          profileId: profile.id,
          ip: ip || 'unknown',
        },
      })
      .catch((e) => console.error('Erro ao registrar visita:', e));

    /**
     * Formatamos o retorno para que os projetos fiquem no primeiro nível
     * do objeto, facilitando o uso no Frontend.
     */
    return {
      ...profile,
      userId: profile.userId, // Garantimos que o userId da conta está presente para o chat
      projects: profile.user?.projects || []
    };
  }
}