import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);


  await prismaService.$connect();
  console.log('Conexión con la base de datos está OK');


  await app.listen(3000);
  console.log('Nodemon escuchando al puerto 3000');
}

bootstrap();