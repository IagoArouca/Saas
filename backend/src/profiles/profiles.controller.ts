import { 
  Controller, 
  Put, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Param, 
  Ip,
  UseInterceptors, 
  UploadedFile     
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'; 

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly cloudinaryService: CloudinaryService 
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req: any) {
    // getByUserId agora lida com as duas tabelas automaticamente
    return this.profilesService.getByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.profilesService.update(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    // 1. Faz upload para o Cloudinary
    const result = await this.cloudinaryService.uploadImage(file, 'mochila_dev/avatars');
    
    // 2. CORREÇÃO: Usa o método updateAvatar que criamos para decidir a tabela (Profile ou RecruiterProfile)
    // Usamos result.url ou result.secure_url dependendo do retorno do seu CloudinaryService
    await this.profilesService.updateAvatar(req.user.id, result.secure_url || result.url);
    
    return { url: result.secure_url || result.url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    // 1. Faz upload para o Cloudinary
    const result = await this.cloudinaryService.uploadImage(file, 'mochila_dev/banners');
    
    // 2. CORREÇÃO: Usa o método updateBanner específico
    await this.profilesService.updateBanner(req.user.id, result.secure_url || result.url);
    
    return { url: result.secure_url || result.url };
  }

  @Get('public/:username')
  async getPublic(@Param('username') username: string, @Ip() ip: string) {
    return this.profilesService.findPublicProfile(username, ip);
  }
}