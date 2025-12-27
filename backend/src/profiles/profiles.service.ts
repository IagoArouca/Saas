import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) {}

    async update(userId: string, data: any) {
        if (data.username) {
            const usernameLower = data.username.toLowerCase();
            
            const existing = await this.prisma.profile.findFirst({
                where: { 
                    username: usernameLower,
                    NOT: { userId: userId } 
                }
                });

                if (existing) {
                throw new BadRequestException('Este username já está em uso.');
                }
            
            data.username = usernameLower;
        }

        return this.prisma.profile.update({
            where: { userId },
            data
        });
    }

    async getByUserId(userId: string) {
        return this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { email: true, role: true } } }
        });
    }

    async findPublicProfile(username: string) {
  const profile = await this.prisma.profile.findUnique({
    where: { username }, 
    include: {
      user: { select: { role: true } },
      projects: true,
    },
  });

  if (!profile) throw new NotFoundException('Perfil não encontrado');
  return profile;
}
}
