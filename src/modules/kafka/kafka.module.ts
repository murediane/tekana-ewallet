import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { AppConfigService } from '../../config/appconfig.service';
import { AppConfigModule } from '../../config/appconfig.module';

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (appConfigService: AppConfigService) => {
        const kafkaServiceOptions = appConfigService.kafkaConfigOptions;
        return ClientProxyFactory.create(kafkaServiceOptions);
      },
      inject: [AppConfigService],
    },
    KafkaService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
