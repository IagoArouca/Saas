import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) {}

    async update(userId: string, data: any) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId},
        });

        if(!profile) {
            throw new NotFoundException('Perfil não encontrado');
        }

        return this.prisma.prisma.profile.update({
            where: { userId },
            data: {
                bio: data.bio,
                avatar: data.avatar,

            },
        });
    }

    async getByUserId(userId: string) {
        return this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { email: true, role: true } } }
        });
    }
}
