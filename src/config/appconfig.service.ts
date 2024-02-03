import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

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
}
