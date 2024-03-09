-- AlterTable
ALTER TABLE `FeatureChangeLog` ADD COLUMN `projectId` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('VALUE_CHANGE', 'CREATE', 'DELETE') NOT NULL DEFAULT 'VALUE_CHANGE';

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
