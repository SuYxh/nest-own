import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { format } from 'date-fns';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, callback) => {
          const timestamp = format(new Date(), 'yyyyMMddHHmmss');
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const newFilename = `${timestamp}-${name}${fileExtName}`;
          callback(null, newFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      url: `http://localhost:3001/public/${file.filename}`,
    };
    return response;
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './public' });
  }

  @Post('uploadQiniu')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToQiniu(@UploadedFile() file: Express.Multer.File) {
    const url = await this.filesService.uploadFile(file);
    return { url };
  }
}
