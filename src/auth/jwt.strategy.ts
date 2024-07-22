import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 指定了从请求头中提取 JWT 令牌的方式
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 设置为 false 表示不忽略过期的令牌
      ignoreExpiration: false,
      // 是用于验证 JWT 签名的密钥。
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
