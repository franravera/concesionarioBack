import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { Vehiculo } from '@prisma/client';
import { storage } from '../cloudinary/cloudinary.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

type VehiculoConImagenes = Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'> & { imagenes?: string[] };

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imagenes', maxCount: 5 }], { storage }))
  async create(
    @UploadedFiles() files: { imagenes?: Express.Multer.File[] },
    @Body() vehiculoData: Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ message: string; vehiculo: Vehiculo }> {
    try {
      Logger.log('Datos recibidos del cliente:', JSON.stringify(vehiculoData));
      const imagenes = files?.imagenes ? files.imagenes.map((file) => file.path) : [];
      const vehiculoConImagenes: VehiculoConImagenes = { ...vehiculoData, imagenes };
      const vehiculo = await this.vehiculosService.create(vehiculoConImagenes);
      return { message: 'Vehículo creado con éxito.', vehiculo };
    } catch (error) {
      throw new HttpException('Error al crear el vehículo.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('rango-kilometraje')
  async getKilometrajeRange(): Promise<{ minKilometraje: number; maxKilometraje: number }> {
    try {
      return await this.vehiculosService.getKilometrajeRange();
    } catch (error) {
      console.error('Error al obtener el rango de kilometraje:', error);
      throw new HttpException('Error al obtener el rango de kilometraje.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


@Get('combustible')
async getUniqueCombustible(): Promise<string[]> {
  try {
    return await this.vehiculosService.getUniqueCombustible();
  } catch (error) {
    console.error('Error al obtener combustible:', error);  
    throw new HttpException('Error al obtener combustible.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
@Get('transmision')
async getUniqueTransmision(): Promise<string[]> {
  try {
    return await this.vehiculosService.getUniqueTransmision();
  } catch (error) {
    console.error('Error al obtener transmision:', error);  
    throw new HttpException('Error al obtener transmision.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
// @Get()
// async findAll(
//   @Query('transmision') transmision?: string,
//   @Query('combustible') combustible?: string,
//   @Query('minKilometraje') minKilometraje?: string,
//   @Query('maxKilometraje') maxKilometraje?: string,
//   @Query('minPrecio') minPrecio?: string,
//   @Query('maxPrecio') maxPrecio?: string,
//   @Query('tipoId') tipoId?: string, 
//   @Query('brandId') brandId?: string 
// ): Promise<{ message: string; vehiculos: Vehiculo[] }> {
//   try {
//     const whereClause: any = {};

//     if (transmision) {
//       whereClause.transmision = transmision;
//     }
//     if (combustible) {
//       whereClause.combustible = combustible.trim();
//     }

//     if (minKilometraje && isNaN(Number(minKilometraje))) {
//       throw new HttpException('minKilometraje debe ser un número válido.', HttpStatus.BAD_REQUEST);
//     }
//     if (maxKilometraje && isNaN(Number(maxKilometraje))) {
//       throw new HttpException('maxKilometraje debe ser un número válido.', HttpStatus.BAD_REQUEST);
//     }
    

//     if (minPrecio || maxPrecio) {
//       whereClause.precio = {};
//       if (minPrecio) {
//         whereClause.precio.gte = Number(minPrecio);
//       }
//       if (maxPrecio) {
//         whereClause.precio.lte = Number(maxPrecio);
//       }
//     }

//     if (tipoId) {
//       whereClause.tipoId = Number(tipoId);
//     }
//     if (brandId) {
//       whereClause.brandId = Number(brandId);
//     }
   
//     const vehiculos = await this.vehiculosService.findAll(whereClause);
//     return { message: 'Vehículos recuperados con éxito.', vehiculos };
//   } catch (error) {
//     console.error('Error al recuperar los vehículos:', error);
//     throw new HttpException('Error al recuperar los vehículos.', HttpStatus.INTERNAL_SERVER_ERROR);
//   }
// }
@Get()
async findAll(
  @Query('transmision') transmision?: string,
  @Query('combustible') combustible?: string,
  @Query('minKilometraje') minKilometraje?: string,
  @Query('maxKilometraje') maxKilometraje?: string,
  @Query('minPrecio') minPrecio?: string,
  @Query('maxPrecio') maxPrecio?: string,
  @Query('tipoId') tipoId?: string,
  @Query('brandId') brandId?: string 
): Promise<{ message: string; vehiculos: Vehiculo[] }> {
  try {
    const whereClause: any = {};

    if (transmision) {
      whereClause.transmision = transmision;
    }
    if (combustible) {
      whereClause.combustible = combustible.trim();
    }

    if (minKilometraje && isNaN(Number(minKilometraje))) {
      throw new HttpException('minKilometraje debe ser un número válido.', HttpStatus.BAD_REQUEST);
    }
    if (maxKilometraje && isNaN(Number(maxKilometraje))) {
      throw new HttpException('maxKilometraje debe ser un número válido.', HttpStatus.BAD_REQUEST);
    }

    // Verificar el rango de kilometraje
    if (minKilometraje) {
      whereClause.kilometraje = { gte: Number(minKilometraje) };
    }
    if (maxKilometraje) {
      if (!whereClause.kilometraje) {
        whereClause.kilometraje = {};
      }
      whereClause.kilometraje.lte = Number(maxKilometraje);
    }

    // Filtrar por precios
    if (minPrecio || maxPrecio) {
      whereClause.precio = {};
      if (minPrecio) {
        whereClause.precio.gte = Number(minPrecio);
      }
      if (maxPrecio) {
        whereClause.precio.lte = Number(maxPrecio);
      }
    }

    // Filtrar por tipoId y brandId
    if (tipoId) {
      whereClause.tipoId = Number(tipoId);
    }
    if (brandId) {
      whereClause.brandId = Number(brandId);
    }

    const vehiculos = await this.vehiculosService.findAll(whereClause);
    return { message: 'Vehículos recuperados con éxito.', vehiculos };
  } catch (error) {
    console.error('Error al recuperar los vehículos:', error);
    throw new HttpException('Error al recuperar los vehículos.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ message: string; vehiculo: Vehiculo | null }> {
      const tipoId = parseInt(id, 10);
      if (isNaN(tipoId)) {
          throw new HttpException("El ID debe ser un número", HttpStatus.BAD_REQUEST);
      }
  
      try {
          const vehiculo = await this.vehiculosService.findOne(tipoId);
          if (!vehiculo) {
              throw new HttpException('Vehículo no encontrado.', HttpStatus.NOT_FOUND);
          }
          return { message: 'Vehículo recuperado con éxito.', vehiculo };
      } catch (error) {
          throw new HttpException('Error al recuperar el vehículo.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
  

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'imagenes', maxCount: 5 }], { storage }))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { imagenes?: Express.Multer.File[] },
    @Body() vehiculoData: Partial<Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<{ message: string; vehiculo: Vehiculo }> {
    try {
      const imagenes = files?.imagenes ? files.imagenes.map((file) => file.path) : undefined;
      const vehiculoConImagenes: Partial<VehiculoConImagenes> = { ...vehiculoData, imagenes };
      const vehiculo = await this.vehiculosService.update(+id, vehiculoConImagenes);
      return { message: 'Vehículo actualizado con éxito.', vehiculo };
    } catch (error) {
      throw new HttpException('Error al actualizar el vehículo.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string; vehiculo: Vehiculo }> {
    try {
      const vehiculo = await this.vehiculosService.remove(+id);
      return { message: 'Vehículo eliminado con éxito.', vehiculo };
    } catch (error) {
      throw new HttpException('Error al eliminar el vehículo.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':vehiculoId/imagenes')
  async removeImagesByIds(
    @Param('vehiculoId') vehiculoId: string,
    @Query('ids') ids: string,
  ): Promise<{ message: string }> {
    if (!ids) {
      throw new HttpException('No se proporcionaron IDs de imágenes para eliminar.', HttpStatus.BAD_REQUEST);
    }

    const imageIds = ids.split(',').map((id) => parseInt(id, 10));
    if (imageIds.some(isNaN)) {
      throw new HttpException('Uno o más IDs proporcionados no son válidos.', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.vehiculosService.removeImagesByIds(+vehiculoId, imageIds);
      return { message: `Se han eliminado las imágenes con los IDs: ${ids} del vehículo con ID ${vehiculoId}.` };
    } catch (error) {
      throw new HttpException('Error al eliminar las imágenes. Por favor, verifica los datos proporcionados.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':vehiculoId/imagenes-por-url')
  async removeImagesByUrls(
    @Param('vehiculoId') vehiculoId: string,
    @Query('urls') urls: string,
  ): Promise<{ message: string }> {
    if (!urls) {
      throw new HttpException('No se proporcionaron URLs de imágenes para eliminar.', HttpStatus.BAD_REQUEST);
    }

    const imageUrls = urls.split(',');
    if (imageUrls.length === 0) {
      throw new HttpException('No se proporcionaron URLs válidas.', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.vehiculosService.removeImagesByUrls(+vehiculoId, imageUrls);
      return { message: `Se han eliminado las imágenes con las URLs: ${urls} del vehículo con ID ${vehiculoId}.` };
    } catch (error) {
      throw new HttpException('Error al eliminar las imágenes. Por favor, verifica los datos proporcionados.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}