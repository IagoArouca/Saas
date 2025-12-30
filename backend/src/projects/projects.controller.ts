import { 
  Controller, Get, Post, Body, Put, Param, Delete, Patch,
  UseGuards, Request, UseInterceptors, UploadedFile, Query 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Controller('projects')
@UseGuards(JwtAuthGuard) 
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.secure_url };
  }

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.projectsService.create(req.user.userId, body);
  }

  @Get('my-projects')
  findAll(@Request() req: any) {
    return this.projectsService.findAllMine(req.user.userId);
  }

  @Get('explore')
  explore(@Query('tech') tech?: string) {
    return this.projectsService.explore(tech);
  }

  // ROTA ATUALIZADA: Patch para destacar projeto
  @Patch(':id/highlight')
  toggleHighlight(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.toggleHighlight(id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.projectsService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.remove(id, req.user.userId);
  }
}