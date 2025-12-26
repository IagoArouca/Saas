import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruitersService {
  constructor(private prisma: PrismaService) {}

  async findAllDevs() {
    return this.prisma.user.findMany({
      where: { role: 'DEV' },
      select: {
        id: true,
        email: true,
        profile: true,
        projects: true,
      }
    });
  }
  async findDevById(devId: string) {
    return this.prisma.user.findUnique({
      where: { id: devId, role: 'DEV' },
      include: {
        profile: true,
        projects: true,
      }
    });
  }
}