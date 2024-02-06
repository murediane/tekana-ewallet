import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport, RedisOptions } from '@nestjs/microservices';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaConfigOptions(): KafkaOptions {
    const kafkaURL = this.configService.get<string>('KAFKA_URL');

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [kafkaURL],
          clientId: 'ewallet',
        },
        consumer: {
          groupId: 'ewallet-consumer',
        },
      },
    };
  }

  get redisConfigOptions(): RedisOptions {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');

    return {
      transport: Transport.REDIS,
      options: {
        host: redisHost,
        port: redisPort,
      },
    };
  }
}
