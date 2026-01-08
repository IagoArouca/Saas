import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conectado ao Supabase com sucesso!');
    } catch (error) {
      console.error('⚠️ Erro ao conectar no boot (o app continuará subindo):', error.message);
    }
  }
}