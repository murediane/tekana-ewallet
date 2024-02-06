import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/user.entity';
import { WalletTransaction } from './entities/transactions.entity';
import { WalletsService } from './wallet.service';
import { WalletsController } from './wallet.controllers';
import { UsersModule } from '../user/user.module';
import { UtilService } from '../../common/util.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, UtilService],
  exports: [WalletsService],
})
export class WalletsModule {}
