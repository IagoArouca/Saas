import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { profile } from 'console';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10); 
        const baseUsername = data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;

        return this.prisma.user.create({
            data: {
            email: data.email,
            password: hashedPassword,
            role: data.role,
            profile: {
                create: {
                username: username.toLowerCase(), 
                }
            }
            }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
