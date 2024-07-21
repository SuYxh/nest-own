import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('error')
  findError() {
    // throw new Error('chucuoll');
    throw new InternalServerErrorException(`User with ID  not found`);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
