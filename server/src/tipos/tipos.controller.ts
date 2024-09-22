import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { TiposService } from "./tipos.service";
import { Tipo } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { storage } from "src/cloudinary/cloudinary.config";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

type TipoConImagen = Omit<Tipo, 'id'> & { imagen?: string };

@Controller("tipos")
export class TiposController {
  constructor(private readonly tiposService: TiposService) { }


  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'ImageTipo' }], { storage }))
  async create(
    @UploadedFiles() files: { ImageTipo?: Express.Multer.File[] },
    @Body() tipoData: Omit<Tipo, 'id'>,
  ): Promise<{ message: string; tipo: Tipo }> {
    try {
      Logger.log('Datos recibidos del cliente:', JSON.stringify(tipoData));
      const imagenUrl = files?.ImageTipo?.[0]?.path;
      const tipoConImagen: TipoConImagen = { ...tipoData, imagen: imagenUrl };
      const tipo = await this.tiposService.create(tipoConImagen);
      return { message: 'tipo creada con éxito.', tipo };
    } catch (error) {
      Logger.error('Error al crear la tipo:', error);
      throw new HttpException('Error al crear la tipo.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'ImageTipo' }], { storage }))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { ImageTipo?: Express.Multer.File[] },
    @Body() tipoData: Omit<Tipo, 'id'>,
  ): Promise<{ message: string; tipo: Tipo }> {
    try {
      const imagenUrl = files?.ImageTipo?.[0]?.path;
      const tipoConImagenes: TipoConImagen = {
        ...tipoData,
        imagen: imagenUrl || '',
      };
      const tipo = await this.tiposService.update(+id, tipoConImagenes);
      return { message: 'Tipo actualizado con éxito.', tipo };
    } catch (error) {
      throw new HttpException('Error al actualizar la brand.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Put(":id")
  // async update(
  //   @Param("id") id: string,
  //   @Body() data: TipoConImagen // Cambiado a TipoConImagen
  // ): Promise<Tipo> {
  //   const tipoId = parseInt(id, 10);
  //   if (isNaN(tipoId)) {
  //     throw new HttpException("El ID debe ser un número", HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     return await this.tiposService.update(tipoId, data);
  //   } catch (error) {
  //     throw new HttpException(
  //       `Error al actualizar el tipo: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Tipo> {
    const tipoId = parseInt(id, 10);
    if (isNaN(tipoId)) {
      throw new HttpException("El ID debe ser un número", HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.tiposService.remove(tipoId);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el tipo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll(): Promise<Tipo[]> {
    try {
      const tipos = await this.tiposService.findAll();
      if (!tipos) {
        throw new HttpException("No se encontraron tipos", HttpStatus.NOT_FOUND);
      }
      return tipos;
    } catch (error) {
      Logger.error('Error al obtener los tipos:', error);
      throw new HttpException(
        `Error al obtener los tipos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Tipo> {
    const tipoId = parseInt(id, 10);
    if (isNaN(tipoId)) {
      throw new HttpException("El ID debe ser un número", HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.tiposService.findOne(tipoId);
    } catch (error) {
      throw new NotFoundException(`El tipo con ID ${id} no fue encontrado`);
    }
  }

}  