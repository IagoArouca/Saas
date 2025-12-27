import { Controller, Put, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard;


@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

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

    @Get('public/:username')
    async getPublic(@Param('username') username: string) {
        return this.profilesService.findPublicProfile(username);
}
}
