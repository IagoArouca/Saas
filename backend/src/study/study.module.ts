import { Module } from '@nestjs/common';
import { StudyTrackService } from './study.service'; // Nome que definimos no arquivo anterior
import { StudyTrackController } from './study.controller'; // Nome que definimos no arquivo anterior
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

@Module({
  // Os nomes aqui devem ser EXATAMENTE iguais aos nomes das classes exportadas
  controllers: [StudyTrackController],
  providers: [StudyTrackService, PrismaService],
  exports: [StudyTrackService] // Exportar caso outro módulo precise usar
})
export class StudyModule {}