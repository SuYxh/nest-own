import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { whitelist } from './whitelist.config';

export const whitelist = [
  '127.0.0.1', // 本地 IP
  '::1', // 本地 IPv6
  'example.com', // 示例域名
  // 添加更多白名单项
];

@Injectable()
export class WhitelistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;
    const clientHostname = req.hostname;

    if (!whitelist.includes(clientIp) && !whitelist.includes(clientHostname)) {
      throw new UnauthorizedException('Access denied');
    }

    next();
  }
}
