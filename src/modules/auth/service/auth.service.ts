import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/users/domain/entities/user';
import type { LoginDto } from '../domain/dto/login.dto';
import type { CreateUserDto } from 'src/modules/users/domain/dto/create-user.dto';
import type { RegisterDto } from '../domain/dto/register.dto';
import type { ResetPasswordDto } from '../domain/dto/reset-password.dto';
import { FindByEmailService } from 'src/modules/users/services/find-by-email.service';
import { CreateUserService } from 'src/modules/users/services/create.service';
import type { ValidateTokenDTO } from '../domain/dto/validate-token.dto';
import { UpdateUserService } from 'src/modules/users/services/update.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  
    private readonly findByEmailService: FindByEmailService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  async generateJwtToken(user: User) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: 60 * 60 * 60 * 24, //1d
      issuer: 'nest-api-auth',
      audience: 'users',
    };

    return { access_token: this.jwtService.sign(payload, options) };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.findByEmailService.execute(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return await this.generateJwtToken(user);
  }

  async register(body: RegisterDto) {
    const newUser: CreateUserDto = {
      email: body.email,
      name: body.name,
      username: body.username,
      password: body.password,
    } as CreateUserDto;

    const user = await this.createUserService.execute(newUser);

    return await this.generateJwtToken(user);
  }

  async reset({ token, password }: ResetPasswordDto) {
    const { valid, decoded } = await this.validateToken(token);

    if (!valid || !decoded) throw new UnauthorizedException('Invalid token');

    const user: User = await this.updateUserService.execute(
      Number(decoded.sub),
      {
        password,
      },
    );

    return await this.generateJwtToken(user);
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'nest-api-auth',
        audience: 'users',
      });

      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }
}
