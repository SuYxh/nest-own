import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { VerificationCodeService } from './verification-code.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('账户名或者密码错误');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async sendVerificationCode(email: string): Promise<void> {
    const code = this.verificationCodeService.generateCode(email);
    await this.mailService.sendVerificationCode(email, code);
  }

  async loginWithCode(email: string, code: string): Promise<string> {
    const isValid = this.verificationCodeService.validateCode(email, code);
    if (!isValid) {
      throw new UnauthorizedException('验证码错误');
    }

    const payload = { email };
    return this.jwtService.sign(payload);
  }
}
