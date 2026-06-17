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

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;

export type Config = typeof config;
