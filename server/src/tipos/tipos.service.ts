import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Tipo } from "@prisma/client";

type TipoConImagen = Omit<Tipo, 'id'> & { 
  imagen?: string; 
  vehiculos?: { connect: { id: number }[] }; 
};

@Injectable()
export class TiposService {
  constructor(private prisma: PrismaService) { }

  async removeImageByUrl(tipoId:number, url:string):Promise<void>{
    const tipo = await this.prisma.tipo.findUnique({
      where:{ id:tipoId },      
    })
    if(tipo && tipo.ImageTipo === url){
      await this.prisma.tipo.update({
        where:{ id:tipoId },
        data: { ImageTipo:'' }
      })
    }
  }

  async create(data: TipoConImagen): Promise<Tipo> {
    try {
      return await this.prisma.tipo.create({
        data: {
          nombre: data.nombre,
          ImageTipo: data.imagen || ''
        },
      });
    } catch (error) {
      throw new Error("Error al crear el tipo: " + error.message);
    }
  }

  async update(id: number, data: TipoConImagen): Promise<Tipo> {
    const tipo = await this.prisma.tipo.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException(`El tipo con ID ${id} no existe`);
    }
    try {
      return await this.prisma.tipo.update({
        where: { id },
        data: {
          nombre: data.nombre,
          ImageTipo: data.imagen || '',
          vehiculos: data.vehiculos
            ? {
              connect: data.vehiculos.connect.map((vehiculo) => ({
                id: vehiculo.id,
              }))
            }
            : undefined,
        },
      });
    } catch (error) {
      throw new Error("Error al actualizar el tipo: " + error.message);
    }
  }
  

  async findAll(): Promise<Tipo[]> {
    const tipos = await this.prisma.tipo.findMany({
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
            brand:true
          },
        },
      },
    });
    Logger.log('Tipos obtenidos:', tipos); // Agregar log
    return tipos;
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
            brand:true
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