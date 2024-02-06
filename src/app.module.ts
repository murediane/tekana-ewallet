import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/user.module';
import { WalletsModule } from './modules/wallet/wallet.module';
import { AuthService } from './modules/authentication/authentication.service';
import { LocalStrategy } from './modules/authentication/strategies/ local.strategy';
import { JwtStrategy } from './modules/authentication/strategies/jwt.strategy';
import { AuthController } from './modules/authentication/authentication.controller';
import { User } from './modules/user/user.entity';
import { Wallet } from './modules/wallet/entities/wallet.entity';
import { WalletTransaction } from './modules/wallet/entities/transactions.entity';
import { AppConfigService } from './config/appconfig.service';
import { KafkaModule } from './modules/kafka/kafka.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: configuration().database.user,
      password: configuration().database.password,
      connectString: configuration().database.db_connection,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),

    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    WalletsModule,
    KafkaModule,
    RedisModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AppConfigService,
  ],
})
export class AppModule {}
