# 🌶️ Chico Pimenta — E-commerce de Pimentas Artesanais

> Plataforma de venda de pimentas e molhos artesanais com pagamento integrado

## 📋 Documentação

- **[PLANEJAMENTO.md](./PLANEJAMENTO.md)** — Roadmap e tech stack
- **[ESTRUTURA.md](./ESTRUTURA.md)** — Organização do projeto
- **[DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md)** — Guia de dev
- **[TAREFAS.md](./TAREFAS.md)** — Checklist de features

## 🚀 Quick Start

### 1. Clonar e instalar

```bash
cd site-chico
npm install
```

### 2. Configurar ambiente

```bash
cp .env.example .env.local
# Editar e adicionar credenciais
```

### 3. Rodar locally

```bash
npm run dev
# Abrir http://localhost:3000
```

## 📦 Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM, MySQL
- **Pagamento:** Mercado Pago, PIX, Cartão de Crédito
- **Auth:** NextAuth.js

## 📁 Estrutura

```
site-chico/
├── src/
│   ├── app/              # Rotas (Next.js App Router)
│   ├── components/       # Componentes React (Common, Product, Payment)
│   ├── lib/              # Configuração e helpers
│   ├── types/            # Types TypeScript
│   ├── constants/        # Constantes
│   ├── utils/            # Funções auxiliares
│   ├── services/         # API clients
│   └── hooks/            # Custom hooks
├── public/               # Arquivos estáticos
└── prisma/               # Schema do banco
```

## 🎯 Features Principais

- ✅ Catálogo de produtos (pimentas, molhos, kits)
- ✅ Carrinho de compras
- ✅ Checkout com 3 métodos de pagamento
  - 💳 Cartão de crédito/débito
  - 📲 PIX
  - 💰 Mercado Pago
- ⏳ Sistema de autenticação (NextAuth)
- ⏳ Dashboard do cliente
- ⏳ Admin panel

## 🔧 Variáveis de Ambiente

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_token
MERCADOPAGO_PUBLIC_KEY=sua_public_key

# PIX
PIX_KEY=sua_chave_pix

# Database
DATABASE_URL=mysql://user:pass@localhost/dbname

# Auth
NEXTAUTH_SECRET=seu_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🚢 Deploy

Hostinger com suporte a Node.js:

```bash
npm run build
npm start
```

## 📞 Contato

- **WhatsApp:** (16) 99636-9876
- **Instagram:** @francis.molhos
- **Email:** contato@chicomolhos.com.br

---

**Desenvolvedor:** Junior Dev  
**Última atualização:** 28/03/2026
