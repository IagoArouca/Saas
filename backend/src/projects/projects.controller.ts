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
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.projectsService.create(userId, body);
  }

  @Get('my-projects')
  findAll(@Request() req: any) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.projectsService.findAllMine(userId);
  }

  @Get('explore')
  explore(@Query('tech') tech?: string) {
    return this.projectsService.explore(tech);
  }

  @Patch(':id/highlight')
  toggleHighlight(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.projectsService.toggleHighlight(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.projectsService.update(id, userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.projectsService.remove(id, userId);
  }
}