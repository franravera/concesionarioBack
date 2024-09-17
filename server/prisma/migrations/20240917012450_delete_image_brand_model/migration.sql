/*
  Warnings:

  - You are about to drop the `imagebrand` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ImageBrand` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehiculoId` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `imagebrand` DROP FOREIGN KEY `ImageBrand_brandId_fkey`;

-- AlterTable
ALTER TABLE `brand` ADD COLUMN `ImageBrand` VARCHAR(191) NOT NULL,
    ADD COLUMN `vehiculoId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `imagebrand`;

-- AddForeignKey
ALTER TABLE `Brand` ADD CONSTRAINT `Brand_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
