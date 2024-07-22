import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

// const logDirectory = path.resolve(__dirname, '../logs'); // 自定义日志文件存储路径
const logDirectory = path.join(process.cwd(), 'logs'); // 使用 process.cwd() 获取项目根目录，并指定 logs 目录
console.log('logDirectory', logDirectory);

const infoTransport: DailyRotateFile = new DailyRotateFile({
  filename: path.join(logDirectory, 'application-info-%DATE%.log'), // 指定正常请求日志文件路径
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info', // 只记录 info 级别的日志
});

const errorTransport: DailyRotateFile = new DailyRotateFile({
  filename: path.join(logDirectory, 'application-error-%DATE%.log'), // 指定错误日志文件路径
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error', // 只记录 error 级别的日志
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    infoTransport,
    errorTransport,
  ],
});

export default logger;
