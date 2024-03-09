-- AlterTable
ALTER TABLE `FeatureChangeLog` MODIFY `type` ENUM('VALUE_CHANGE', 'CREATE', 'DELETE') NULL;
