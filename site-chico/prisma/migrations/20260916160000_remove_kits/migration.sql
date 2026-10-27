-- Kits are no longer part of the catalog.
ALTER TABLE `Product` DROP COLUMN `kitItems`;
ALTER TABLE `Product`
  MODIFY `category` ENUM('PIMENTA', 'MOLHO') NOT NULL;
