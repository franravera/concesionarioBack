import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  
  async create(data: { email: string; password: string }): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }


  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  
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