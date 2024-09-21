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
  } from "@nestjs/common";
  import { TiposService } from "./tipos.service";
  import { Tipo } from "@prisma/client";
  import { Prisma } from "@prisma/client";
  
  @Controller("tipos")
  export class TiposController {
    constructor(private readonly tiposService: TiposService) {}
  
   
    @Post()
    async create(@Body() data: Prisma.TipoCreateInput): Promise<Tipo> {
      try {
        return await this.tiposService.create(data);
      } catch (error) {
        throw new HttpException(
          `Error al crear el tipo: ${error.message}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }    
  
    @Put(":id")
    async update(
      @Param("id") id: string,
      @Body() data: Prisma.TipoUpdateInput
    ): Promise<Tipo> {
      const tipoId = parseInt(id, 10);
      if (isNaN(tipoId)) {
        throw new HttpException("El ID debe ser un número", HttpStatus.BAD_REQUEST);
      }  
      try {
        return await this.tiposService.update(tipoId, data);
      } catch (error) {
        throw new HttpException(
          `Error al actualizar el tipo: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  
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
        return await this.tiposService.findAll();
      } catch (error) {
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