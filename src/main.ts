import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CheckRequiredEnvVariables } from './helpers/checkEnv';
import { LoggerMiddleware } from './logger/logger.middleware';
import helmet from 'helmet';
import { SanitizeMiddleware } from './sanitizer/sanitizer.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Replace with your domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(LoggerMiddleware);
  app.use(new SanitizeMiddleware().use);
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com'"],
      },
    }),
  );
  const configService = app.get(ConfigService);
  CheckRequiredEnvVariables(configService, [
    'MAX_FXQL',
    'MIN_VALUE',
    'MONGO_URI',
  ]);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
