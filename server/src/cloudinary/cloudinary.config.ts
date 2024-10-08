// src/cloudinary/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

cloudinary.config({
  cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
  api_key: configService.get<string>('CLOUDINARY_API_KEY'),
  api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => { 
    return {
      folder: 'vehiculos', // Carpeta en Cloudinary donde se guardarán las imágenes
      format: undefined, 
      public_id: file.originalname.split('.')[0], 
    };
  },
});