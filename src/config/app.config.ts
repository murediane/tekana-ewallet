import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppConfigService } from './appconfig.service';
import configuration from './configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableAppConfig = async (app: INestApplication) => {
  app.enableShutdownHooks();

  if (!configuration().isTest()) {
    await connectToKafkaMicroservice(app);

    await connectToRedisMicroservice(app);

    await app.startAllMicroservices();

    //set up swagger
    swaggerModuleSetup(app);
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

const swaggerModuleSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Tekana Ewallet')
    .setDescription('Tekana Ewallet API description')
    .setVersion('1.0')
    .addTag('ewallet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
