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

        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role as Role,
                profile: {
                    create: {}
                }
            },
            include: { profile: true}
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
