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

    async findPublicProfile(username: string, ip: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { username },
            include: { projects: true }
        });

        if (profile) {
            this.prisma.profileVisit.create({
            data: { profileId: profile.id, ip }
            }).catch(e => console.error(e));
        }
        
        return profile;
    }
}
