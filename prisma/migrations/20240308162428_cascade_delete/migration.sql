-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_environmentId_fkey`;

-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `Environment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
