import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './configuration';
import { Users } from '../modules/users/user.entity';
import { UsersModule } from '../modules/users/user.module';
import { WalletTransaction } from '../modules/wallets/entities/transactions.entity';
import { Wallet } from '../modules/wallets/entities/wallet.entity';
import { WalletsModule } from '../modules/wallets/wallet.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: configuration().database.test,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users, Wallet, WalletTransaction]),
    UsersModule,
    WalletsModule,
  ],

  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
