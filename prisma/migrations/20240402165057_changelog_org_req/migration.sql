/*
  Warnings:

  - Made the column `orgId` on table `FeatureChangeLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_orgId_fkey`;

-- AlterTable
ALTER TABLE `FeatureChangeLog` MODIFY `orgId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Org`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
