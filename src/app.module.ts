// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AppService } from './app.service';
// import configuration from './config/configuration';
// import { UsersModule } from './modules/users/user.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthService } from './modules/authentication/authentication.service';
// import { LocalStrategy } from './modules/authentication/strategies/ local.strategy';
// import { JwtStrategy } from './modules/authentication/strategies/jwt.strategy';
// import { AuthController } from './modules/authentication/authentication.controller';
// import { WalletsModule } from './modules/wallets/wallet.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from './modules/users/user.entity';
// import { Wallet } from './modules/wallets/entities/wallet.entity';
// import { WalletTransaction } from './modules/wallets/entities/transactions.entity';
// import { RedisModule } from 'nestjs-redis';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [configuration],
//     }),
 
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: configuration().database.url,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([Users, Wallet, WalletTransaction]),
//     UsersModule,
//     WalletsModule,
//     PassportModule,
//     JwtModule.register({
//       secret: configuration().jwt.secret,
//       signOptions: { expiresIn: '1h' },
//     }),
//     RedisModule.forRootAsync({
//       useFactory: (configService: ConfigService) => configService.get('redis'),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AppController, AuthController],
//   providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
// })
// export class AppModule {}
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
      synchronize: true, // Caution: set to false in productionß
      logging: true,
    }),

    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    WalletsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
