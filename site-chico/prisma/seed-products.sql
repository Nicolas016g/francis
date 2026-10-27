INSERT INTO Product (
  id, slug, name, description, category, price, imageUrl, tag,
  heatLevel, sauceType, stockQuantity, active,
  weightGrams, heightCm, widthCm, lengthCm, createdAt, updatedAt
) VALUES
(UUID(), 'mostarda-artesanal', 'Mostarda Artesanal', 'Mostarda de grãos inteiros com toque de mel. Textura rústica e sabor encorpado para sanduíches, carnes e charcutaria.', 'MOLHO', 28.90, NULL, 'Clássico', NULL, 'Clássico', 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'molho-ketchup', 'Ketchup Artesanal', 'Ketchup artesanal feito com tomates frescos selecionados, com textura cremosa e sabor equilibrado.', 'MOLHO', 28.90, '/products/ketchup-vertical.png', 'Clássico', NULL, 'Clássico', 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-jalapeno', 'Pimenta Jalapeño', 'Pimenta Jalapeño de sabor levemente frutado e ardência progressiva, ideal para nachos, tacos e receitas especiais.', 'PIMENTA', 28.90, NULL, NULL, 3, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-dedo-de-moca', 'Pimenta Dedo de Moça', 'Pimenta de sabor marcante e ardência equilibrada, feita com pimentas frescas selecionadas em conserva artesanal.', 'PIMENTA', 28.90, NULL, 'Mais Vendida', 2, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'pimenta-caseira', 'Pimenta Caseira', 'Blend de pimentas suaves com alho e azeite, feito de forma artesanal para acompanhar qualquer prato.', 'PIMENTA', 28.90, '/products/Caseirinha Fundo Preto vertical.png', NULL, 1, NULL, 0, TRUE, 400, 10, 7, 7, NOW(), NOW()),
(UUID(), 'molho-barbecue', 'Barbecue Artesanal', 'Molho artesanal com notas defumadas, acucar mascavo e especiarias, ideal para carnes e hamburgueres.', 'MOLHO', 28.90, NULL, 'Destaque', NULL, 'Defumado', 0, TRUE, 400, 10, 7, 7, NOW(), NOW())
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
