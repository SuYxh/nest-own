import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get('QINIU_ACCESS_KEY');
    this.secretKey = this.configService.get('QINIU_SECRET_KEY');
    this.bucket = this.configService.get('QINIU_BUCKET');
    this.domain = this.configService.get('QINIU_DOMAIN');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const options = {
      scope: this.bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    // Convert Buffer to ReadableStream
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    return new Promise((resolve, reject) => {
      formUploader.putStream(
        uploadToken,
        `aigc/${file.originalname}`,
        readableStream,
        putExtra,
        (err, body, info) => {
          console.log('info', info);
          if (err) {
            return reject(err);
          }
          if (info.statusCode === 200) {
            const url = `http://${this.domain}/${body.key}`;
            resolve(url);
          } else {
            reject(new Error('Upload failed'));
          }
        },
      );
    });
  }
}
