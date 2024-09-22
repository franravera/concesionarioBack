import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Vehiculo } from '@prisma/client';

type VehiculoConImagenes = Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'> & { 
  imagenes?: string[];
  brandId?: number;
  tipoId?: number; 
};

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
    const { tipoId, brandId, imagenes, ...vehiculoData } = data;
  
    return this.prisma.vehiculo.create({
      data: {
        ...vehiculoData,
        tipo: tipoId ? { connect: { id: tipoId } } : undefined,
        brand: brandId ? { connect: { id: brandId } } : undefined,
        imagenes: {
          create: imagenes?.map((url) => ({ url })) || [],
        },
      },
      include: {
        imagenes: true,
        tipo: true,
      },
    });
  }
  
  
  async update(id: number, data: Partial<VehiculoConImagenes>): Promise<Vehiculo> {
    const { imagenes, brandId, tipoId, ...vehiculoData } = data;
  
    const updatedVehiculo = await this.prisma.vehiculo.update({
      where: { id },
      data: {
        ...vehiculoData,
        brand: brandId ? { connect: { id: brandId } } : undefined,
        tipo: tipoId ? { connect: { id: tipoId } } : undefined,
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
      include: {
        imagenes: true,
        tipo: true,
        brand: true,
      },
    });
  }
  
  async findOne(id: number): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: {
        imagenes: true,
        tipo: true, 
        brand: true,
      },
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

  async getKilometrajeRange(): Promise<{ minKilometraje: number; maxKilometraje: number }> {
    const [min, max] = await Promise.all([
      this.prisma.vehiculo.findFirst({ orderBy: { kilometraje: 'asc' }, select: { kilometraje: true } }),
      this.prisma.vehiculo.findFirst({ orderBy: { kilometraje: 'desc' }, select: { kilometraje: true } }),
    ]);

    return { minKilometraje: min?.kilometraje ?? 0, maxKilometraje: max?.kilometraje ?? 0 };
  }
}
