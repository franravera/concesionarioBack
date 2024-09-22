import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Prisma, Tipo } from "@prisma/client";

@Injectable()
export class TiposService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.TipoCreateInput): Promise<Tipo> {
    try {
      return await this.prisma.tipo.create({
        data: {
          nombre: data.nombre,
        },
      });
    } catch (error) {
      throw new Error("Error al crear el tipo: " + error.message);
    }
  }

  async update(id: number, data: Prisma.TipoUpdateInput): Promise<Tipo> {
    const tipo = await this.prisma.tipo.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`El tipo con ID ${id} no existe`);
    }
    try {
      return await this.prisma.tipo.update({
        where: { id },
        data: {
          nombre: data.nombre,
          vehiculos: data.vehiculos
            ? {
              connect: Array.isArray(data.vehiculos.connect)
                ? data.vehiculos.connect.map((vehiculo) => ({
                  id: vehiculo.id,
                }))
                : data.vehiculos.connect
            }
            : undefined,
        },
      });
    } catch (error) {
      throw new Error("Error al actualizar el tipo: " + error.message);
    }
  }

  async findAll(): Promise<Tipo[]> {
    return await this.prisma.tipo.findMany({
      include: {
        vehiculos: {
          select: {
            id: true,
            modelo: true,
            year: true,
            descripcion: true,
            precio: true,
            transmision: true,
            combustible: true,
            kilometraje: true,
            imagenes: true,
          }
        }
      },
    });
  }

  async findOne(id: number): Promise<Tipo | null> {
    const tipo = await this.prisma.tipo.findUnique({
      where: { id },
      include: {
        vehiculos: {
          select: {
            id: true,
            modelo: true,
            year: true,
            descripcion: true,
            precio: true,
            transmision: true,
            combustible: true,
            kilometraje: true,
            imagenes: true,
          }
        }
      },
    });
    if (!tipo) {
      throw new NotFoundException(`El tipo con ID ${id} no existe`);
    }
    return tipo;
  }

  async remove(id: number): Promise<Tipo> {
    const tipo = await this.prisma.tipo.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`El tipo con ID ${id} no existe`);
    }
    try {
      return await this.prisma.tipo.delete({ where: { id } });
    } catch (error) {
      throw new Error("Error al eliminar el tipo: " + error.message);
    }
  }
}