import {
  Inject,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(
      'allExceptions.filter:',
      request.url,
      (exception as any).message,
    );
    console.log('allExceptions.filter:exception', exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      console.log('exceptionResponse', exceptionResponse);

      if (typeof exceptionResponse === 'object') {
        const msg = (exceptionResponse as any).message || message;
        if (typeof msg === 'string') {
          message = msg;
        } else if (Array.isArray(msg)) {
          message = msg.join(',');
        }
      } else {
        message = exceptionResponse as string;
      }
    }

    // this.logger.error(`${request.method} ${request.url}`, {
    //   status,
    //   stack: exception instanceof Error ? exception.stack : undefined,
    // });

    response.status(status).json({
      data: null,
      code: -1,
      message,
    });
  }
}
