import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors({
  origin: [
    'http://localhost:3000',
  
    'https://agewmidr.vercel.app',
  ],
  credentials: true,
});

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fire Barber API')
    .setDescription('Fire Barber Booking System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();