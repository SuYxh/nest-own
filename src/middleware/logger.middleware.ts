import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston.config'; // 导入你的 winston 配置

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); // 记录请求开始时间
    const { method, originalUrl, query, body } = req;

    console.log('LoggerMiddleware called'); // 调试信息

    // 记录请求日志
    logger.info('Request', { method, originalUrl, query, body });

    // 监听响应结束事件
    res.on('finish', () => {
      const end = Date.now(); // 记录请求结束时间
      const duration = end - start; // 计算请求处理时间
      const { statusCode } = res;
      console.log('logger.middleware-请求耗时', duration);

      if (statusCode >= 400) {
        // 记录错误响应日志
        logger.error('Response', {
          method,
          originalUrl,
          statusCode,
          query,
          body,
          duration,
        });
      } else {
        // 记录正常响应日志
        logger.info('Response', {
          method,
          originalUrl,
          statusCode,
          query,
          body,
          duration,
        });
      }
    });

    next();
  }
}
