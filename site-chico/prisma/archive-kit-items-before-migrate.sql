CREATE TABLE IF NOT EXISTS `ProductKitItemsArchive` (
  `productId` VARCHAR(191) NOT NULL,
  `kitItems` JSON NOT NULL,
  `archivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `ProductKitItemsArchive` (`productId`, `kitItems`)
SELECT `id`, `kitItems`
FROM `Product`
WHERE `kitItems` IS NOT NULL
ON DUPLICATE KEY UPDATE
  `kitItems` = VALUES(`kitItems`),
  `archivedAt` = CURRENT_TIMESTAMP(3);
