-- CreateIndex
CREATE FULLTEXT INDEX `Environment_key_name_idx` ON `Environment`(`key`, `name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Feature_key_idx` ON `Feature`(`key`);

-- CreateIndex
CREATE FULLTEXT INDEX `Project_key_name_idx` ON `Project`(`key`, `name`);
