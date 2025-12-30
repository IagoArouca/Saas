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
        // 1. Verifica se já existe
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('Este e-mail já está cadastrado');
        }

        // 2. Guarda a senha original para o login automático
        const plainPassword = userData.password;

        // 3. Cria o usuário (o UsersService faz o hash lá dentro)
        await this.usersService.create(userData);

        // 4. Realiza o login automático usando a senha SEM hash
        return this.login(userData.email, plainPassword);
    }

    async login(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Compara a senha digitada com o hash do banco
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
            access_token: this.jwtService.sign(payload), // Retorno em snake_case
            user: {
                id: user.id,
                name: user.profile?.fullName || 'Usuário',
                email: user.email,
                role: user.role
            }
        };
    }
}