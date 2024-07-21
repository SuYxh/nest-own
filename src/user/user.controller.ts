import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('error')
  findError() {
    throw new Error('chucuoll');
    // throw new InternalServerErrorException(`User with ID  not found`);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }
}
