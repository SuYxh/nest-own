// import { PartialType } from '@nestjs/mapped-types';
// import { CreatePostDto } from './create-post.dto';

// export class UpdatePostDto extends PartialType(CreatePostDto) {}

import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly author?: string;

  @IsString()
  @IsOptional()
  readonly content?: string;

  @IsUrl()
  @IsOptional()
  readonly thumb_url?: string;

  @IsInt()
  @IsOptional()
  readonly type?: number;
}
