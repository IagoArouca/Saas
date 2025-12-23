import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.login(body.email, body.password)
    }
}
