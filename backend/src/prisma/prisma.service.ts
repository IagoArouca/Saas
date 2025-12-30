import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['error', 'warn'], // log de erros e avisos do Prisma
    });
  }

  async onModuleInit() {
    await this.$connect(); // conecta automaticamente ao iniciar o módulo
  }
}
