import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('sendEmailCode')
  @HttpCode(200)
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    await this.authService.sendVerificationCode(email);
  }

  @Post('emailLogin')
  @HttpCode(200)
  async loginWithCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.loginWithCode(email, code);
    return { accessToken: accessToken };
  }
}
