import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import type { RegisterDto } from '../domain/dto/register.dto';
import type { ResetPasswordDto } from '../domain/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')           
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Patch('reset-password')
  async resetPassword(@Body() { token, password }: ResetPasswordDto) {
    return this.authService.reset({ token, password });
  }
}