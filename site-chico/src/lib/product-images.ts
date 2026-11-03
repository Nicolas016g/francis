// As fotos vêm do campo `imageUrl` do produto (cadastrado no painel /admin).
export function getProductImages(_slug: string, imageUrl?: string | null): string[] {
  return imageUrl ? [imageUrl] : [];
}

export function getProductCover(slug: string, imageUrl?: string | null): string | null {
  return getProductImages(slug, imageUrl)[0] ?? null;
}
