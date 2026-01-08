import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module'; 

@Module({
  imports: [CloudinaryModule], 
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}