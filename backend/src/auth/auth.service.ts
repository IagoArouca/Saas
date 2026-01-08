import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(userData: any) {
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('Este e-mail já está cadastrado');
        }
        const plainPassword = userData.password;
        await this.usersService.create(userData);
        return this.login(userData.email, plainPassword);
    }

    async login(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { 
            sub: user.id, 
            email: user.email, 
            role: user.role 
        };

        return {
            access_token: this.jwtService.sign(payload), 
            user: {
                id: user.id,
                name: user.profile?.fullName || 'Usuário',
                email: user.email,
                role: user.role
            }
        };
    }
}