import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module'; // Importe seu módulo de imagem

@Module({
  imports: [CloudinaryModule], // ADICIONE ISSO AQUI
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}