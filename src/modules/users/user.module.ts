import { Module } from '@nestjs/common';
import { Users } from './user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { WalletsModule } from '../wallets/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), WalletsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
