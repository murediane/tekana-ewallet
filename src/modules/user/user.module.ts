import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { WalletsModule } from '../wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WalletsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
