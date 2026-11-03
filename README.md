# 🌶️ Chico Pimenta — E-commerce de Pimentas Artesanais

> Plataforma de venda de pimentas e molhos artesanais com pagamento integrado

## 📋 Documentação

- **[docs/ANALISE.md](./docs/ANALISE.md)** — Análise de prontidão e checklist de lançamento
- **[docs/SISTEMA_LOGIN_CADASTRO.md](./docs/SISTEMA_LOGIN_CADASTRO.md)** — Login e cadastro

## 🗂️ Organização do repositório

- `site-chico/` — aplicação Next.js (código, Prisma, assets públicos)
- `docs/` — documentação
- `scripts/` — utilitários (`start_remoto.bat`, `remove_background.py`)
- `assets/logos/` — logos originais

## 🚀 Quick Start

### 1. Clonar e instalar

```bash
cd site-chico
npm install
```

### 2. Configurar ambiente

```bash
cp .env.example .env
# Preencha as variáveis (banco MySQL 8, Mercado Pago, Melhor Envio, Resend, segredos)
```

### 3. Banco de dados

```bash
npx prisma migrate deploy   # aplica as migrations em um MySQL vazio
npx prisma generate
```

O repositório **não** contém dados nem credenciais. `prisma/seed-products.sql` traz o catálogo inicial (sem fotos e sem estoque); revise preços e composição antes de usar.

### 4. Rodar localmente

```bash
npm run dev
# Abrir http://localhost:3000
```

### 5. Painel administrativo

`/admin` (produtos, estoque, pedidos) exige usuário com `role = ADMIN` e e-mail verificado. Crie a conta no site e promova-a:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'email@do-dono.com';
```

As fotos dos produtos não estão no repositório: informe o link da imagem em cada produto no painel (ou adicione arquivos em `site-chico/public/` e use o caminho em `imageUrl`).

### Pendências para o lançamento

Veja o checklist completo em [docs/ANALISE.md](./docs/ANALISE.md).

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
- ✅ Autenticação própria (cadastro, login, verificação de e-mail, recuperação de senha)
- ✅ Área do cliente (`/minha-conta`) com status e rastreio
- ✅ Frete por Melhor Envio e e-mails via Resend
- ✅ Painel administrativo (`/admin`) com histórico de estoque

## 🔧 Variáveis de Ambiente

Todas estão documentadas em [`site-chico/.env.example`](./site-chico/.env.example).

## 🚢 Deploy

Deploy em hospedagem com suporte a Node.js (ex.: Hostinger). Configure as variáveis de ambiente no painel da hospedagem:

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
