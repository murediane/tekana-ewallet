
import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { WalletsController } from './wallet.controllers';
import { Transaction,TransactionSchema } from './schemas/transactions.schema';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema },{name: Transaction.name, schema: TransactionSchema }]),
        forwardRef(()=> UsersModule)
      ],
controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule{}