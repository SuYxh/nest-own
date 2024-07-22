import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CustomConfigModule } from './config/config.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import logger from './logger/winston.config';
import envConfig from '../config/env';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { WhitelistMiddleware } from './middleware/whitelist.middleware';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    WinstonModule.forRoot({
      instance: logger,
    }),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'public'),
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public', // 可选，指定静态文件服务的根路径
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USERNAME', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', 'root'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        autoLoadEntities: true,
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        retryDelay: 500, //重试连接数据库间隔
        retryAttempts: 10, //重试连接数据库的次数
      }),
    }),
    UserModule,
    CustomConfigModule,
    PostModule,
    AuthModule,
    FilesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware)
      // 可以排除某些路由
      // .exclude(
      //   { path: 'public', method: RequestMethod.GET },
      //   { path: 'public', method: RequestMethod.POST },
      // )
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
