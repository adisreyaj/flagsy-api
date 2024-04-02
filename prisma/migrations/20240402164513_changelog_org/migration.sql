-- AlterTable
ALTER TABLE `FeatureChangeLog` ADD COLUMN `orgId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Org`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
