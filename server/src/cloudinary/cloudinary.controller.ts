import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload') // <-- Este es el prefijo de la ruta del controlador
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post() // <-- Esto significa que el endpoint es POST /upload
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }
}