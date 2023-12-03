-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_environmentId_fkey`;

-- DropForeignKey
ALTER TABLE `FeatureChangeLog` DROP FOREIGN KEY `FeatureChangeLog_featureId_fkey`;

-- DropForeignKey
ALTER TABLE `FeatureEnvironmentConfig` DROP FOREIGN KEY `FeatureEnvironmentConfig_environmentId_fkey`;

-- DropForeignKey
ALTER TABLE `FeatureEnvironmentConfig` DROP FOREIGN KEY `FeatureEnvironmentConfig_featureId_fkey`;

-- AlterTable
ALTER TABLE `FeatureChangeLog` MODIFY `featureId` VARCHAR(191) NULL,
    MODIFY `environmentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `FeatureEnvironmentConfig` ADD CONSTRAINT `FeatureEnvironmentConfig_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureEnvironmentConfig` ADD CONSTRAINT `FeatureEnvironmentConfig_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `Environment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `Feature`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeatureChangeLog` ADD CONSTRAINT `FeatureChangeLog_environmentId_fkey` FOREIGN KEY (`environmentId`) REFERENCES `Environment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
