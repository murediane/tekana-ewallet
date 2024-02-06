import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_SERVICE')
    private readonly redisClient: ClientRedis,
  ) {}

  async onModuleInit() {
    await this.redisClient.connect();

    console.log(`🎉 Client successfully connected Redis server... 👏`);
  }

  async onModuleDestroy() {
    this.redisClient.close();

    console.log(`🖐  Client Redis disconnected  ...`);
  }

  async sendEventNewAdminCreated(newUser: User) {
    this.redisClient.emit('NEW_ADMIN_CREATED', {
      key: uuidv4(),
      value: instanceToPlain(newUser),
    });
  }
}
