from PIL import Image
from collections import Counter
import os

folder = r"c:\Users\LOCAL_ADM\Desktop\SiteChico\site-chico\public"
logos = [
    "logo_principal.png",
    "logo_entreemcontato.png",
    "logo_contato.png",
    "logo_rodape.png"
]

for logo in logos:
    path = os.path.join(folder, logo)
    if os.path.exists(path):
        # Abrir imagem
        img = Image.open(path).convert("RGBA")
        
        # Pegar dados dos pixels
        data = img.getdata()
        
        # Detectar cor de fundo (cor mais comum nas bordas)
        width, height = img.size
        
        # Coletar cores das bordas
        border_colors = []
        for x in range(min(20, width)):
            border_colors.append(data[x])  # topo
            if height > 1:
                border_colors.append(data[(height-1) * width + x])  # baixo
        for y in range(min(20, height)):
            border_colors.append(data[y * width])  # esquerda
            if width > 1:
                border_colors.append(data[y * width + (width-1)])  # direita
        
        # Encontrar cor mais frequente nas bordas
        color_counts = Counter(border_colors)
        bg_color = color_counts.most_common(1)[0][0]
        
        # Criar nova imagem com transparência
        new_data = []
        threshold = 40  # tolerância de cor
        
        for pixel in data:
            # Se a cor é similar à cor de fundo, deixar transparente
            if len(pixel) == 4:
                r, g, b, a = pixel
            else:
                r, g, b = pixel
                a = 255
            
            bg_r, bg_g, bg_b = bg_color[:3]
            
            # Calcular diferença
            diff = abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b)
            
            if diff < threshold:
                new_data.append((r, g, b, 0))  # transparente
            else:
                new_data.append((r, g, b, 255))  # opaco
        
        # Aplicar novos dados
        img.putdata(new_data)
        img.save(path)
        print(f"✓ {logo} - fundo removido")

print("\nTodas as imagens foram processadas!")
