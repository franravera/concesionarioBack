// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from '../src/cloudinary/cloudinary.controller'; // Verifica la ruta
import { VehiculosController } from './vehiculos/vehiculos.controller';
import { VehiculosService } from './vehiculos/vehiculos.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el módulo de configuración esté disponible globalmente
    }),
  ],
  controllers: [CloudinaryController, VehiculosController, UsuariosController], // Solo los controladores
  providers: [PrismaService, CloudinaryService, VehiculosService, UsuariosService ], // Proveedores adecuados
})
export class AppModule {}