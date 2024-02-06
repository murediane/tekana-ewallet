import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateAdminDTO } from './user.dto';
import { JWTAuthGuard } from '../authentication/guards/jwt-auth-guard';
import { RolesGuard } from '../authentication/guards/roles.guards';
import { Roles } from '../../shared/decorators/role.decorator';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppEnums } from '../../common/enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: Partial<User>) {
    return this.userService.createUser(user);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('/admin')
  @Roles(AppEnums.RolesEnum.Admin, AppEnums.RolesEnum.SuperAdmin)
  async createAdmin(@Body() user: CreateAdminDTO) {
    return this.userService.createAdminUser(user);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  @Roles(AppEnums.RolesEnum.Admin, AppEnums.RolesEnum.SuperAdmin)
  async findAll() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('user_email/:email')
  @Roles(AppEnums.RolesEnum.Admin, AppEnums.RolesEnum.SuperAdmin)
  async findUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern('NEW_USER_CREATED')
  async handleNewUserCreatedMessage(newUser: User) {
    console.warn('New User Created', JSON.stringify(newUser));
  }

  @EventPattern('NEW_ADMIN_CREATED')
  async handleNewAdminCreatedMessage(newUser: User) {
    console.warn('New User Created', JSON.stringify(newUser));
  }
}
