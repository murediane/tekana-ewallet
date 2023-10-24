
import { Module } from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { WalletsController } from './wallet.controllers';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
      ],
controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule{}