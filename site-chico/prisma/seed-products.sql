INSERT INTO Product (
  id, slug, name, description, category, price, imageUrl, tag,
  heatLevel, sauceType, stockQuantity, active,
  weightGrams, heightCm, widthCm, lengthCm, createdAt, updatedAt
) VALUES
(UUID(), 'mostarda-artesanal', 'Mostarda Artesanal', 'Mostarda artesanal para acompanhar hambúrgueres, sanduíches e carnes, com sabor equilibrado e textura cremosa.', 'MOLHO', 28.90, NULL, 'Clássico', NULL, 'Clássico', 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'molho-ketchup', 'Ketchup Artesanal', 'Ketchup artesanal feito com tomates selecionados, com textura cremosa e sabor equilibrado.', 'MOLHO', 28.90, NULL, 'Clássico', NULL, 'Clássico', 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-jalapeno', 'Pimenta Jalapeño', 'Pimenta Jalapeño de sabor levemente frutado e ardência progressiva, ideal para nachos, tacos e receitas especiais.', 'PIMENTA', 28.90, NULL, NULL, 3, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-dedo-de-moca', 'Pimenta Dedo de Moça', 'Pimenta de sabor marcante e ardência equilibrada, feita com pimentas frescas selecionadas em conserva artesanal.', 'PIMENTA', 28.90, NULL, 'Mais Vendida', 2, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-caseira', 'Pimenta Caseira', 'Blend de pimentas suaves com alho e azeite, feito de forma artesanal para acompanhar qualquer prato.', 'PIMENTA', 28.90, NULL, NULL, 1, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'molho-barbecue', 'Barbecue Artesanal', 'Molho artesanal com notas defumadas e especiarias, ideal para carnes e hambúrgueres.', 'MOLHO', 28.90, NULL, 'Destaque', NULL, 'Defumado', 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'kit-pimentas', 'Kit Pimentas', 'Quatro pimentas artesanais: Caseira, Dedo de Moça, Jalapeño e Pequimenta.', 'KIT', 99.90, NULL, 'Kit', NULL, 'Especial', 0, TRUE, 1600, 20, 14, 14, NOW(), NOW()),
(UUID(), 'kit-hamburgada', 'Kit Hamburgada', 'Ketchup, Mostarda, Barbecue e Relish de Pepino para completar sua hamburgada.', 'KIT', 99.90, NULL, 'Kit', NULL, 'Especial', 0, TRUE, 1600, 20, 14, 14, NOW(), NOW()),
(UUID(), 'kit-misto', 'Kit Misto', 'Ketchup e Mostarda, Caseira e Dedo de Moça em uma seleção especial.', 'KIT', 99.90, NULL, 'Kit', NULL, 'Especial', 0, TRUE, 1600, 20, 14, 14, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  category = VALUES(category),
  price = VALUES(price),
  imageUrl = VALUES(imageUrl),
  tag = VALUES(tag),
  heatLevel = VALUES(heatLevel),
  sauceType = VALUES(sauceType),
  updatedAt = NOW();
