import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponse } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/allExceptions.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('API 文档')
    .setDescription('API 描述')
    .setVersion('1.0')
    .addTag('标签')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
