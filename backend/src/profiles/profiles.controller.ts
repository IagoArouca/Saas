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
    const result = await this.cloudinaryService.uploadImage(file, 'mochila_dev/avatars');
    await this.profilesService.update(req.user.id, { avatar: result.secure_url });
    return { url: result.secure_url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    const result = await this.cloudinaryService.uploadImage(file, 'mochila_dev/banners');
    await this.profilesService.update(req.user.id, { bannerUrl: result.secure_url });
    return { url: result.secure_url };
  }

  @Get('public/:username')
  async getPublic(@Param('username') username: string, @Ip() ip: string) {
    // Ao buscar o perfil público, o service deve incrementar o ProfileVisit
    return this.profilesService.findPublicProfile(username, ip);
  }
}