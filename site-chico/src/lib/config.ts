/**
 * Configuração centralizada da aplicação
 * Importar sempre via: import { config } from '@/lib'
 */

export const config = {
  app: {
    name: 'Chico Pimenta',
    description: 'Pimentas artesanais e molhos autorais',
    version: '0.1.0',
    author: 'Junior Dev',
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
  },

  payment: {
    pix: {
      key: process.env.PIX_KEY,
    },
    mercadoPago: {
      accessToken: process.env.MP_ACCESS_TOKEN,
      publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
    },
  },

  shipping: {
    melhorEnvio: {
      token: process.env.MELHOR_ENVIO_TOKEN,
      sandbox: process.env.MELHOR_ENVIO_SANDBOX === 'true',
      // CEP de origem (endereço da loja)
      fromPostalCode: process.env.MELHOR_ENVIO_FROM_CEP || '14800000',
    },
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  contact: {
    whatsapp: '551696369876',
    instagram: 'francis.molhos',
    email: 'contato@chicomolhos.com.br',
    phone: '(16) 99636-9876',
  },

  email: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    inbox: process.env.CONTACT_EMAIL || 'contato@chicomolhos.com.br',
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;

export type Config = typeof config;
