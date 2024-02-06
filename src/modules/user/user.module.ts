import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { WalletsModule } from '../wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '../kafka/kafka.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WalletsModule,
    KafkaModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
