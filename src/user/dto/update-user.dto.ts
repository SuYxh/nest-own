import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  role?: string;
}
