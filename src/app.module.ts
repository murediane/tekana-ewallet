import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; 
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './modules/authentication/authentication.service'
import { LocalStrategy } from './modules/authentication/strategies/ local.strategy';
import { JwtStrategy } from './modules/authentication/strategies/jwt.strategy'
import { AuthController } from './modules/authentication/authentication.controller';
import { WalletsModule } from './modules/wallets/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[configuration]
    }),
    MongooseModule.forRoot(configuration().database.url,{
      connectionFactory:(connection) =>{
       return connection;
      }
    }),
    UsersModule,
    WalletsModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService,AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
