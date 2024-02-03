import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { instanceToPlain } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('NEW_USER_CREATED');

    await this.client.connect();

    console.log(`🎉 Client successfully connected Kafka server... 👏`);
  }

  async onModuleDestroy() {
    await this.client.close();

    console.log(`🖐  Client Kafka disconnected  ...`);
  }

  async sendNotificationNewUserCreated(newUser: User) {
    this.client.emit('NEW_USER_CREATED', {
      key: uuidv4(),
      value: instanceToPlain(newUser),
    });
  }
}
