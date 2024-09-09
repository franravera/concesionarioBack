import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener una instancia del servicio de Prisma
  const prismaService = app.get(PrismaService);

  // Manejar la conexión y desconexión del servicio Prisma
  await prismaService.$connect();
  console.log('Conexión con la base de datos está OK');

  // Iniciar la aplicación en el puerto 3000
  await app.listen(3000);
  console.log('Nodemon escuchando al puerto 3000');
}

bootstrap();