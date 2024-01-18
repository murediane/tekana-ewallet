import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/user.entity';
import { WalletTransaction } from './entities/transactions.entity';
import { WalletsService } from './wallet.service';
import { WalletsController } from './wallet.controllers';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
