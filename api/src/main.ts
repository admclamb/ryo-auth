import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import * as nocache from 'nocache';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

function checkEnvironment(configService: ConfigService) {
  const requiredEnvVars = [
    'PORT',
    'CLIENT_ORIGIN_URL',
    'POSTGRESQL_HOST',
    'POSTGRESQL_PORT',
    'POSTGRESQL_USERNAME',
    'POSTGRESQL_PASSWORD',
    'POSTGRESQL_NAME',
    'SYNCHRONIZE_DATABASE',
    'BCRYPT_SALT_ROUNDS',
    'JWT_SECRET',
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!configService.get<string>(envVar)) {
      throw Error(`Undefined environment variable: ${envVar}`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log'],
  });

  const configService = app.get<ConfigService>(ConfigService);
  checkEnvironment(configService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(nocache());

  app.use(cookieParser());

  app.enableCors({
    origin: configService.get<string>('CLIENT_ORIGIN_URL'),
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Authorization', 'Content-Type', 'content-type'],
    maxAge: 86400,
    credentials: true,
  });

  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  await app.listen(configService.get<string>('PORT'), () => {
    console.log(`Listening on port 🚀 ${configService.get<string>('PORT')} 🚀`);
  });
}

bootstrap();
