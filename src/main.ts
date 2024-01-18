import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  const env = configService.get<string>('env');
  await app.listen(port);
  console.log(`${env} app running on ${await app.getUrl()}`);
}
bootstrap();
