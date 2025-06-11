import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/corsConfig';
import { ValidationPipe } from '@nestjs/common';
import { validationConfig } from './config/validation.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('예약 시스템 API')
    .setDescription('Auth 포함한 전체 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
