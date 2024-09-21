import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Brand } from "@prisma/client";

type BrandConImagen = Omit<Brand, 'id' | 'createdAt' | 'updatedAt'> & { imagen?: string; vehiculoId?: number };

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

    async removeImageByUrl(brandId: number, url: string): Promise<void> {
        const brand = await this.prisma.brand.findUnique({
            where: { id: brandId },
        });
        if (brand && brand.ImageBrand === url) {
            await this.prisma.brand.update({
                where: { id: brandId },
                data: { ImageBrand: '' },
            });
        }
    }

    async create(data: BrandConImagen): Promise<Brand> {
        return this.prisma.brand.create({
            data: {
                nombre: data.nombre,
                ImageBrand: data.imagen || '',
                vehiculos: {
                    // connect: { id: data.vehiculoId }, 
                }
            }
        });
    }

    async update(id: number, data: BrandConImagen): Promise<Brand> {
        return this.prisma.brand.update({
            where: { id },
            data: {
                nombre: data.nombre,
                ImageBrand: data.imagen || '',
                vehiculos: data.vehiculoId ? { connect: { id: data.vehiculoId } } : undefined, 
            },
        });
    }

    async findAll(): Promise<Brand[]> {
        return this.prisma.brand.findMany({
            include: { vehiculos: true },
        });
    }

    async findOne(id: number, options?: any): Promise<Brand | null> {
        return this.prisma.brand.findUnique({
            where: { id },
            ...options,
        });
    }

    async remove(id: number): Promise<Brand> {
        return this.prisma.brand.delete({
            where: { id },
        });
    }
}
