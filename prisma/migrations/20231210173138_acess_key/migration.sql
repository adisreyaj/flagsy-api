/*
  Warnings:

  - Added the required column `environmentId` to the `AccessKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccessKey` ADD COLUMN `environmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `AccessKey` ADD CONSTRAINT `AccessKey_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `Environment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
