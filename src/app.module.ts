import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './modules/authentication/authentication.service';
import { LocalStrategy } from './modules/authentication/strategies/ local.strategy';
import { JwtStrategy } from './modules/authentication/strategies/jwt.strategy';
import { AuthController } from './modules/authentication/authentication.controller';
import { WalletsModule } from './modules/wallets/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Wallet } from './modules/wallets/entities/wallet.entity';
import { Transaction } from './modules/wallets/entities/transactions.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([Wallet, Transaction, User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: configuration().database.url,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    WalletsModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
