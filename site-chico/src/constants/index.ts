// Constantes de categorias
export const PRODUCT_CATEGORIES = {
  PIMENTA: 'pimenta',
  MOLHO: 'molho',
  KIT: 'kit',
} as const;

// Constantes de status de pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Constantes de status de pedido
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Constantes de métodos de pagamento
export const PAYMENT_METHODS = {
  CARD: 'card',
  PIX: 'pix',
} as const;

// Mensagens padrão
export const MESSAGES = {
  ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.',
  SUCCESS_PAYMENT: 'Pagamento realizado com sucesso!',
  ERROR_PAYMENT: 'Erro ao processar pagamento.',
  SUCCESS_ORDER: 'Pedido criado com sucesso!',
  ERROR_ORDER: 'Erro ao criar pedido.',
} as const;

// URLs da aplicação
export const ROUTES = {
  HOME: '/',
  PIMENTAS: '/pimentas',
  MOLHOS: '/molhos',
  KITS: '/kits',
  PRODUTO: (slug: string) => `/produto/${slug}`,
  CARRINHO: '/carrinho',
  CHECKOUT: '/checkout',
  SOBRE: '/sobre',
  CONTATO: '/contato',
  LOGIN: '/login',
  MINHA_CONTA: '/minha-conta',
} as const;
