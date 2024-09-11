// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from '../src/cloudinary/cloudinary.controller';
import { VehiculosController } from './vehiculos/vehiculos.controller';
import { VehiculosService } from './vehiculos/vehiculos.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [CloudinaryController, VehiculosController, UsuariosController], 
  providers: [PrismaService, CloudinaryService, VehiculosService, UsuariosService ], 
})
export class AppModule {}