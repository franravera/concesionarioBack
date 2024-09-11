import { Controller, Post, Get, Put, Body, Param,Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '@prisma/client';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: { email: string; password: string }): Promise<{ message: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.create(createUsuarioDto);
      return { message: 'Usuario creado con éxito.', usuario };
    } catch (error) {
      throw new HttpException('Error al crear el usuario. Puede que el email ya esté en uso.', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<{ message: string; usuario: Usuario | null }> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuario recuperado con éxito.', usuario };
  }

  @Get()
  async findAll(): Promise<{ message: string; usuarios: Usuario[] }> {
    const usuarios = await this.usuariosService.findAll();
    return { message: 'Usuarios recuperados con éxito.', usuarios };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: Partial<{ email: string; password: string }>,
  ): Promise<{ message: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.update(+id, updateUsuarioDto);
      return { message: 'Usuario actualizado con éxito.', usuario };
    } catch (error) {
      throw new HttpException('Error al actualizar el usuario. Por favor, verifica los datos proporcionados.', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string; usuario: Usuario }> {
    try {
      const usuario = await this.usuariosService.remove(+id);
      return { message: 'Usuario eliminado con éxito.', usuario };
    } catch (error) {
      throw new HttpException('Error al eliminar el usuario.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}