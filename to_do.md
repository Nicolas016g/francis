# To-Do — Funcionalidades Core
> Stack: Next.js + Prisma + MySQL (Hostinger Business) + Mercado Pago + NextAuth + Melhor Envio
> Atualizado em: 16/06/2026

---

## Ordem de execução

| Etapa | O que fazer | Bloqueante para quê |
|---|---|---|
| **1º** | Instalar Prisma, criar schema, rodar migrations | Tudo depende de ter produtos no banco |
| **2º** | Conectar rotas de produto à API | Páginas de pimentas, molhos, kits, produto dinâmico |
| **3º** | Integrar Mercado Pago | Checkout funcional |
| **4º** | Implementar NextAuth | Minha conta, histórico de pedidos |
| **5º** | Integrar Melhor Envio | Campo de frete no carrinho |

---

## 1. Banco de dados — Prisma + MySQL (Hostinger)

- [ ] Instalar dependências
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] Configurar `prisma/schema.prisma` com provider MySQL
  ```prisma
  datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
  }
  ```
- [ ] Criar schema: tabelas `Product`, `Order`, `OrderItem`, `User`
- [ ] Adicionar `DATABASE_URL` no `.env.production`
  ```
  DATABASE_URL="mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO"
  ```
  > Credenciais: Painel Hostinger → Banco de Dados → MySQL → Detalhes
- [ ] Rodar migration: `npx prisma migrate deploy`
- [ ] Cadastrar produtos no banco (migrar arrays hardcoded das páginas)

---

## 2. Rotas API de produtos

- [ ] Criar `src/lib/prisma.ts` (singleton do Prisma client)
- [ ] Criar `src/app/api/products/route.ts` — lista com filtro por categoria
- [ ] Criar `src/app/api/products/[slug]/route.ts` — produto individual
- [ ] Criar `src/app/api/orders/route.ts` — criar e listar pedidos
- [ ] Atualizar páginas de pimentas, molhos, kits e produto dinâmico para usar as APIs

---

## 3. Pagamento — Mercado Pago SDK

- [ ] Criar conta e gerar token em: mercadopago.com.br → Credenciais de produção
- [ ] Instalar SDK
  ```bash
  npm install mercadopago
  ```
- [ ] Adicionar `MP_ACCESS_TOKEN` no `.env.production`
- [ ] Atualizar `src/app/api/payment/process/route.ts` — substituir mock por SDK real
  ```ts
  import { MercadoPagoConfig, Payment } from 'mercadopago'
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
  ```
- [ ] Atualizar `src/app/api/payment/pix/route.ts` — gerar QR Code real via MP
  > Mercado Pago retorna `qr_code` e `qr_code_base64` prontos para o `PIXPaymentForm`
- [ ] Testar fluxo completo de pagamento em sandbox

---

## 4. Autenticação — NextAuth.js + MySQL

- [ ] Instalar dependências
  ```bash
  npm install next-auth @auth/prisma-adapter bcryptjs
  npm install -D @types/bcryptjs
  ```
- [ ] Adicionar tabelas de autenticação ao schema do Prisma (Account, Session, VerificationToken)
- [ ] Criar `src/app/api/auth/[...nextauth]/route.ts` com `CredentialsProvider`
- [ ] Implementar hash de senha com `bcryptjs` no cadastro
- [ ] Adicionar ao `.env.production`:
  ```
  NEXTAUTH_SECRET=chave-aleatoria-forte
  NEXTAUTH_URL=https://seu-dominio.com.br
  ```
- [ ] Conectar formulários de login/cadastro (`login/page.tsx`, `cadastro/page.tsx`) ao NextAuth
- [ ] Proteger rota `/minha-conta` com verificação de sessão
- [ ] Exibir dados reais do usuário em `/minha-conta`

---

## 5. Frete — Melhor Envio

- [ ] Criar conta gratuita em melhorenvio.com.br e gerar token OAuth
- [ ] Criar `src/app/api/shipping/calculate/route.ts`
  - Recebe: CEP destino + peso + dimensões dos produtos
  - Retorna: opções de frete (Correios, Jadlog, etc.) com prazo e preço
- [ ] Adicionar `MELHOR_ENVIO_TOKEN` no `.env.production`
- [ ] Conectar campo "Calcular frete" na página do carrinho (`carrinho/page.tsx`)
- [ ] Incluir valor do frete no total do checkout

---

## 6. Variáveis de ambiente — `.env.production`

- [ ] Criar arquivo `.env.production` na raiz do projeto com:
  ```
  NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
  DATABASE_URL=mysql://...
  NEXTAUTH_SECRET=...
  NEXTAUTH_URL=https://seu-dominio.com.br
  MP_ACCESS_TOKEN=...
  PIX_KEY=chave-pix-real
  MELHOR_ENVIO_TOKEN=...
  ```
- [ ] Configurar as mesmas variáveis no painel da Hostinger (Node.js app → Environment Variables)

---

## 7. Técnico — limpeza de código (pode fazer a qualquer momento)

- [ ] Remover componentes duplicados na raiz de `src/components/`:
  - `Footer.tsx`, `FeaturedProduct.tsx`, `FeaturedProductsGrid.tsx`, `ProductCard.tsx`, `WhatsAppButton.tsx`, `LayoutWrapper.tsx`
- [ ] Remover pasta `src/components/PaymentMethods/` (duplicata de `Payment/`)
- [ ] Remover `src/components/Common/Navbar.tsx` (código morto — `Header.tsx` é o utilizado)
- [ ] Integrar serviço de e-mail na `/api/contact` (Resend recomendado — free tier generoso)
  ```bash
  npm install resend
  ```
- [ ] Implementar busca client-side no Header (filtrar por nome nos arrays de produto)
