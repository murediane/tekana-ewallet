import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppConfigService } from './appconfig.service';
import configuration from './configuration';

export const enableAppConfig = async (app: INestApplication) => {
  app.enableShutdownHooks();

  if (!configuration().isTest()) {
    await connectToKafkaMicroservice(app);

    await connectToRedisMicroservice(app);

    await app.startAllMicroservices();
  }
};

const connectToKafkaMicroservice = async (app: INestApplication) => {
  app.connectMicroservice<MicroserviceOptions>(
    app.get(AppConfigService).kafkaConfigOptions,
  );
};

const connectToRedisMicroservice = async (app: INestApplication) => {
  app.connectMicroservice<MicroserviceOptions>(
    app.get(AppConfigService).redisConfigOptions,
  );
};
