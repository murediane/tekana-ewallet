import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { RolesEnum, User } from './user.entity';
import { CreateAdminDTO } from './user.dto';
import { JWTAuthGuard } from '../authentication/guards/jwt-auth-guard';
import { RolesGuard } from '../authentication/guards/roles.guards';
import { Roles } from '../../shared/decorators/role.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: Partial<User>) {
    return this.usersService.createUser(user);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('/admin')
  @Roles(RolesEnum.Admin, RolesEnum.SuperAdmin)
  async createAdmin(@Body() user: CreateAdminDTO) {
    return this.usersService.createAdminUser(user);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  @Roles(RolesEnum.Admin, RolesEnum.SuperAdmin)
  async findAll() {
    return this.usersService.findAllUsers();
  }
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('user_email/:email')
  @Roles(RolesEnum.Admin, RolesEnum.SuperAdmin)
  async findUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
  @MessagePattern('NEW_USER_CREATED')
  async handleNewUserCreatedMessage(newUser: User) {
    console.warn('New User Created', JSON.stringify(newUser));
  }
}
