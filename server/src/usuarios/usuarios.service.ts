// src/usuarios/usuarios.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // Método para crear un nuevo usuario
  async create(data: { email: string; password: string }): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  // Método para buscar un usuario por su email
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  // Método para obtener todos los usuarios
  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  // Método para actualizar los datos de un usuario
  async update(id: number, data: Partial<{ email: string; password: string }>): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }
  async remove(id: number): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}