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
import { BrandsService } from './brands.service';
import { Brand } from '@prisma/client';
import { storage } from 'src/cloudinary/cloudinary.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

type BrandConImagen = Omit<Brand, 'id' | 'createdAt' | 'updatedAt'> & { imagen?: string };

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'ImageBrand' }], { storage }))
  async create(
    @UploadedFiles() files: { ImageBrand?: Express.Multer.File[] },
    @Body() brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ message: string; brand: Brand }> {
    try {
      Logger.log('Datos recibidos del cliente:', JSON.stringify(brandData));
      const imagenUrl = files?.ImageBrand?.[0]?.path;
      const brandConImagen: BrandConImagen = { ...brandData, imagen: imagenUrl };
      const brand = await this.brandsService.create(brandConImagen);
      return { message: 'Brand creada con éxito.', brand };
    } catch (error) {
      Logger.error('Error al crear la brand:', error);
      throw new HttpException('Error al crear la brand.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string; brand: Brand }> {
    try {
      const brand = await this.brandsService.remove(+id);
      return { message: 'Brand eliminada con éxito.', brand };
    } catch (error) {
      throw new HttpException('Error al eliminar la brand.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'ImageBrand' }], { storage }))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { ImageBrand?: Express.Multer.File[] },
    @Body() brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ message: string; brand: Brand }> {
    try {
      const imagenUrl = files?.ImageBrand?.[0]?.path;
      const brandConImagenes: BrandConImagen = {
        ...brandData,
        imagen: imagenUrl || '',
      };
      const brand = await this.brandsService.update(+id, brandConImagenes);
      return { message: 'Brand actualizada con éxito.', brand };
    } catch (error) {
      throw new HttpException('Error al actualizar la brand.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':brandId/imagen-por-url')
  async removeImageByUrl(
    @Param('brandId') brandId: string,
    @Query('url') url: string,
  ): Promise<{ message: string }> {
    if (!url) {
      throw new HttpException('No se proporcionaron URLs de imágenes para eliminar.', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.brandsService.removeImageByUrl(+brandId, url);
      return { message: `Se ha eliminado la imagen con la URL: ${url} del brand con ID ${brandId}.` };
    } catch (error) {
      throw new HttpException('Error al eliminar la imagen. Por favor, verifica los datos proporcionados.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<{ brands: Brand[] }> {
    try {
      const brands = await this.brandsService.findAll();
      return { brands };
    } catch (error) {
      throw new HttpException('Error al obtener las marcas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ message: string; brand: Brand | null }> {
    try {
      const brand = await this.brandsService.findOne(+id);
      if (!brand) {
        throw new HttpException('Brand no encontrada.', HttpStatus.NOT_FOUND);
      }
      return { message: 'Bran recuperada con éxito.', brand };
    } catch (error) {
      throw new HttpException('Error al recuperar la brand.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}