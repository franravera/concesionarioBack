// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from '../src/cloudinary/cloudinary.controller'; // Verifica la ruta
import { VehiculosController } from './vehiculos/vehiculos.controller';
import { VehiculosService } from './vehiculos/vehiculos.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el módulo de configuración esté disponible globalmente
    }),
  ],
  controllers: [CloudinaryController, VehiculosController], // Solo los controladores
  providers: [PrismaService, CloudinaryService, VehiculosService], // Proveedores adecuados
})
export class AppModule {}