/*
  Warnings:

  - You are about to drop the column `vehiculoId` on the `brand` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `brand` DROP FOREIGN KEY `Brand_vehiculoId_fkey`;

-- AlterTable
ALTER TABLE `brand` DROP COLUMN `vehiculoId`;

-- AlterTable
ALTER TABLE `vehiculo` ADD COLUMN `brandId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
