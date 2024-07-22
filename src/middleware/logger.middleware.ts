import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston.config'; // 导入你的 winston 配置

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    console.log('LoggerMiddleware called'); // 调试信息

    // 记录请求日志
    logger.info('Request', { method, originalUrl, query, body });

    // 监听响应结束事件
    res.on('finish', () => {
      const { statusCode } = res;
      console.log('statusCode', statusCode);

      if (statusCode >= 400) {
        // 记录错误响应日志
        logger.error('Response', {
          method,
          originalUrl,
          statusCode,
          query,
          body,
        });
      } else {
        // 记录正常响应日志
        logger.info('Response', {
          method,
          originalUrl,
          statusCode,
          query,
          body,
        });
      }
    });

    next();
  }
}
