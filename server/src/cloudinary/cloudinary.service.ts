// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }
}