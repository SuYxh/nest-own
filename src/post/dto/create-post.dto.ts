import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;

  @IsString({ message: '作者必须是字符串' })
  @IsNotEmpty({ message: '作者不能为空' })
  readonly author: string;

  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  readonly content: string;

  @IsUrl({}, { message: '缩略图URL必须是有效的URL' })
  @IsOptional()
  readonly thumb_url?: string;

  @IsInt({ message: '类型必须是整数' })
  @IsOptional()
  readonly type?: number;
}
