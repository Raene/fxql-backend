import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CheckRequiredEnvVariables } from './helpers/checkEnv';
import { LoggerMiddleware } from './logger/logger.middleware';
import helmet from 'helmet';
import { SanitizeMiddleware } from './sanitizer/sanitizer.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('FXQL Parser API')
    .setDescription('API for parsing FXQL currency data')
    .setVersion('1.0')
    .addTag('fxql')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  CheckRequiredEnvVariables(configService, [
    'MAX_FXQL',
    'MIN_VALUE',
    'MONGO_URI',
  ]);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
