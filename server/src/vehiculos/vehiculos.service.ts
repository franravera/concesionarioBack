// src/vehiculos/vehiculos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Vehiculo } from '@prisma/client';

// Define un tipo que incluya todas las propiedades necesarias de Vehiculo y agregue 'imagenes'
type VehiculoConImagenes = Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'> & { imagenes?: string[] };

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

// Método para eliminar una o más imágenes por ID asociadas con un vehículo específico
async removeImagesByIds(vehiculoId: number, imageIds: number[]): Promise<void> {
  await this.prisma.imagen.deleteMany({
    where: {
      id: { in: imageIds },
      vehiculoId: vehiculoId, // Asegurarse de que la imagen pertenezca al vehículo especificado
    },
  });
}

// Método para eliminar una o más imágenes por URL asociadas con un vehículo específico
async removeImagesByUrls(vehiculoId: number, urls: string[]): Promise<void> {
  await this.prisma.imagen.deleteMany({
    where: {
      url: { in: urls },
      vehiculoId: vehiculoId, // Asegurarse de que la imagen pertenezca al vehículo especificado
    },
  });
}

  // Crear un nuevo vehículo con imágenes
  async create(data: VehiculoConImagenes): Promise<Vehiculo> {
    return this.prisma.vehiculo.create({
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        year: Number(data.year),
        descripcion: data.descripcion,
        precio: Number (data.precio),
        kilometraje: data.kilometraje !== undefined ? Number(data.kilometraje) : null,
        imagenes: {
          create: data.imagenes?.map((url) => ({ url })) || [], // Crear registros de imágenes relacionados
        },
      },
      include: {
        imagenes: true, // Incluir imágenes en la respuesta
      },
    });
  }

  // Actualizar un vehículo por su ID con imágenes
  async update(id: number, data: Partial<VehiculoConImagenes>): Promise<Vehiculo> {
    const { imagenes, ...vehiculoData } = data;

    // Actualizar el vehículo sin cambiar las imágenes
    const updatedVehiculo = await this.prisma.vehiculo.update({
      where: { id },
      data: {
        ...vehiculoData,
        kilometraje: vehiculoData.kilometraje ?? null, // Agregar el campo kilometraje, puede ser null
      },
    });


    // Si hay nuevas imágenes para agregar, las creamos
    if (imagenes && imagenes.length > 0) {
      await this.prisma.imagen.createMany({
        data: imagenes.map((url) => ({ url, vehiculoId: id })),
      });
    }

    // Devolver el vehículo actualizado con las imágenes nuevas y existentes
    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: { imagenes: true },
    });
  }

  // Otros métodos...
  async findAll(): Promise<Vehiculo[]> {
    return this.prisma.vehiculo.findMany({
      include: { imagenes: true }, // Incluir imágenes relacionadas en la respuesta
    });
  }

  async findOne(id: number): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({
      where: { id },
      include: { imagenes: true }, // Incluir imágenes relacionadas en la respuesta
    });
  }

  async remove(id: number): Promise<Vehiculo> {
    // Eliminar imágenes relacionadas antes de eliminar el vehículo
    await this.prisma.imagen.deleteMany({
      where: { vehiculoId: id },
    });
    return this.prisma.vehiculo.delete({
      where: { id },
    });
  }
}