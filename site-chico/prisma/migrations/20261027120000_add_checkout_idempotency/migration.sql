ALTER TABLE `Order` ADD COLUMN `checkoutKey` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `Order_checkoutKey_key` ON `Order`(`checkoutKey`);
