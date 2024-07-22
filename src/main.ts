import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponse } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/allExceptions.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_PROVIDER);

  app.useGlobalInterceptors(new CustomResponse());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
