import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: '1825689915@qq.com',
        // smtp授权码
        pass: 'ournwvtxaimpbiaa',
      },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: '"🚀 Nestjs Server" <1825689915@qq.com>',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}，5 分钟内有效!`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
