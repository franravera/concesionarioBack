import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],  // Asegúrate de incluir 'log' para mostrar console.log
  });
  app.useGlobalPipes(new ValidationPipe()); // Habilitar la validación global

  // Permitir solicitudes desde cualquier origen
  app.enableCors({
    origin: '*',  // Permite cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos HTTP permitidos
    credentials: true,  // Permite enviar cookies de autorización
  });

  const prismaService = app.get(PrismaService);

  await prismaService.$connect();
  console.log('Conexión con la base de datos está OK');

  await app.listen(3000);
  console.log('Nodemon escuchando al puerto 3000');
}

bootstrap();