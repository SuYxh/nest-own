import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsUrl()
  @IsOptional()
  readonly thumb_url?: string;

  @IsInt()
  @IsOptional()
  readonly type?: number;
}
