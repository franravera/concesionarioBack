// vehiculos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Vehiculo } from '@prisma/client';

type VehiculoConImagenes = Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'> & { imagenes?: string[] };

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

  async removeImagesByIds(vehiculoId: number, imageIds: number[]): Promise<void> {
    await this.prisma.imagen.deleteMany({
      where: {
        id: { in: imageIds },
        vehiculoId: vehiculoId,
      },
    });
  }

  async removeImagesByUrls(vehiculoId: number, urls: string[]): Promise<void> {
    await this.prisma.imagen.deleteMany({
      where: {
        url: { in: urls },
        vehiculoId: vehiculoId,
      },
    });
  }

  async create(data: VehiculoConImagenes): Promise<Vehiculo> {
    return this.prisma.vehiculo.create({
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        year: Number(data.year),
        descripcion: data.descripcion,
        precio: Number(data.precio),
        transmision: data.transmision !== undefined ? data.transmision : null,
        combustible: data.combustible !== undefined ? data.combustible : null,
        kilometraje: data.kilometraje !== undefined ? Number(data.kilometraje) : null,
        imagenes: {
          create: data.imagenes?.map((url) => ({ url })) || [],
        },
      },
      include: {
        imagenes: true,
      },
    });
  }

  async update(id: number, data: Partial<VehiculoConImagenes>): Promise<Vehiculo> {
    const { imagenes, ...vehiculoData } = data;

    const updatedVehiculo = await this.prisma.vehiculo.update({
      where: { id },
      data: {
        ...vehiculoData,
        kilometraje: vehiculoData.kilometraje ?? null,
      },
    });

    if (imagenes && imagenes.length > 0) {
      await this.prisma.imagen.createMany({
        data: imagenes.map((url) => ({ url, vehiculoId: id })),
      });
    }

    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: { imagenes: true },
    });
  }

 
  async findAll(whereClause: any = {}): Promise<Vehiculo[]> {
    return this.prisma.vehiculo.findMany({
      where: whereClause,
      include: { imagenes: true },
    });
  }


  async findOne(id: number): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: { imagenes: true },
    });
  }

  async remove(id: number): Promise<Vehiculo> {
    await this.prisma.imagen.deleteMany({
      where: { vehiculoId: id },
    });
    return this.prisma.vehiculo.delete({
      where: { id },
    });
  }
  async getUniqueBrands(): Promise<string[]> {
    try {
      const uniqueBrands = await this.prisma.vehiculo.findMany({
        select: { marca: true }, 
        distinct: ['marca'], 
      });


      return uniqueBrands.map((item) => item.marca); 
    } catch (error) {
      console.error('Error al obtener marcas únicas:', error); 
      throw new Error(`Error al obtener marcas únicas: ${error.message}`);
    }
  }
  async getUniqueTypes(): Promise<string[]> {
    const uniqueTypes = await this.prisma.vehiculo.findMany({
      select: { tipo: true },
      distinct: ['tipo'],
    });
    return uniqueTypes.map((item) => item.tipo);
  }
  async getUniqueCombustible(): Promise<string[]> {
    const uniqueCombustible = await this.prisma.vehiculo.findMany({
      select: { combustible: true },
      distinct: ['combustible'],
    });
    return uniqueCombustible.map((item) => item.combustible);
  }

  async getUniqueTransmision(): Promise<string[]> {
    const uniqueTransmision = await this.prisma.vehiculo.findMany({
      select: { transmision: true },
      distinct: ['transmision'],
    });
    return uniqueTransmision.map((item) => item.transmision);
  }
}
