-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `StockMovement` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `reason` ENUM('ENTRY', 'OUTPUT', 'LOSS', 'CORRECTION', 'ORDER_RESERVED', 'ORDER_RELEASED') NOT NULL,
    `delta` INTEGER NOT NULL,
    `balanceAfter` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StockMovement_productId_createdAt_idx`(`productId`, `createdAt`),
    INDEX `StockMovement_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
