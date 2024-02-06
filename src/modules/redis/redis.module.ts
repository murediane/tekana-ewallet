import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppConfigService } from '../../config/appconfig.service';
import { AppConfigModule } from '../../config/appconfig.module';
import { RedisService } from './redis.service';

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'REDIS_SERVICE',
      useFactory: (appConfigService: AppConfigService) => {
        const redisServiceOptions = appConfigService.redisConfigOptions;
        return ClientProxyFactory.create(redisServiceOptions);
      },
      inject: [AppConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
