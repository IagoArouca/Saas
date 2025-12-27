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
    return this.profilesService.getByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.profilesService.update(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    const result = await this.cloudinaryService.uploadImage(file);
    
    await this.profilesService.update(req.user.userId, { avatar: result.secure_url });
    
    return { url: result.secure_url };
  }

  @Get('public/:username')
  async getPublic(@Param('username') username: string, @Ip() ip: string) {
    return this.profilesService.findPublicProfile(username, ip);
  }
}