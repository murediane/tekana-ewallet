import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User> ) {
    return this.usersService.create(user);
  }
}
