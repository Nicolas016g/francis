# Franci's Creative Kitchen — E-commerce

Loja virtual de pimentas, molhos e kits artesanais (marca Chico Pimenta), desenvolvida com Next.js, Prisma e MySQL.

> **Status:** MVP funcional, **ainda não lançado**. Este documento serve de base para que uma equipe técnica assuma e conclua o projeto. A lista do que falta está na seção [11. Pendências para o lançamento](#11-pendências-para-o-lançamento).

O repositório **não contém** credenciais, dados do banco nem fotos de produtos.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Stack tecnológica](#2-stack-tecnológica)
3. [Estrutura do repositório](#3-estrutura-do-repositório)
4. [Primeiros passos](#4-primeiros-passos)
5. [Variáveis de ambiente](#5-variáveis-de-ambiente)
6. [Banco de dados](#6-banco-de-dados)
7. [Painel administrativo](#7-painel-administrativo)
8. [Regras de negócio e fluxos](#8-regras-de-negócio-e-fluxos)
9. [Referência da API](#9-referência-da-api)
10. [Deploy e operação](#10-deploy-e-operação)
11. [Pendências para o lançamento](#11-pendências-para-o-lançamento)
12. [Segurança](#12-segurança)
13. [Contato](#13-contato)

## 1. Visão geral

### Funcionalidades implementadas

| Área | O que existe |
|---|---|
| Catálogo | Pimentas, molhos e kits; página de produto com avaliações; busca |
| Conta | Cadastro, login, verificação de e-mail, recuperação de senha, edição de perfil, histórico de pedidos com status e código de rastreio |
| Carrinho e checkout | Carrinho, endereço com preenchimento por CEP (ViaCEP), escolha de frete, pagamento via Mercado Pago |
| Frete | Cotação automática por CEP, peso e dimensões (Melhor Envio) |
| Pedidos e estoque | Reserva de estoque em transação, expiração de pedidos pendentes, histórico auditável de movimentações |
| E-mail | Verificação de conta, recuperação de senha e formulário de contato (Resend) |
| Painel `/admin` | Dashboard, produtos, estoque e pedidos (envio e rastreio) |
| SEO | `sitemap.xml`, `robots.txt`, imagem Open Graph gerada, favicon |

### Páginas

- **Loja:** `/`, `/pimentas`, `/molhos`, `/kits`, `/produto/[slug]`, `/busca`, `/carrinho`, `/checkout` (+ `/sucesso`, `/pendente`, `/falha`), `/minha-conta`, `/login`, `/cadastro`, `/recuperar-senha`
- **Institucional:** `/sobre`, `/contato`, `/termos`, `/privacidade`
- **Administração:** `/admin`, `/admin/produtos`, `/admin/estoque`, `/admin/pedidos`

### Fora de escopo no código atual

PIX direto (a rota retorna 503; o PIX só aparece via Mercado Pago), e-mails de pedido/pagamento/envio, upload de fotos e estorno automático.

## 2. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.1 (App Router) · React 19 · TypeScript |
| Estilo | Tailwind CSS 4 |
| Banco e ORM | MySQL 8 · Prisma 6 |
| Autenticação | Própria: sessão JWT (`jose`) em cookie HttpOnly `francis_session`; senhas com `bcryptjs`. A biblioteca NextAuth **não** é usada |
| Pagamento | Mercado Pago (Checkout Pro + webhook) |
| Frete | Melhor Envio |
| E-mail | Resend |
| Hospedagem prevista | Hostinger (Node.js) |

Requisitos locais: **Node.js 20.9+** e **MySQL 8**.

## 3. Estrutura do repositório

```
.
├── site-chico/                 Aplicação Next.js
│   ├── prisma/                 schema.prisma, migrations e seed-products.sql
│   ├── public/                 Logos e ícones (sem fotos de produtos)
│   └── src/
│       ├── app/                Rotas: páginas, /api e /admin
│       ├── components/         Common, Product, Payment, PaymentMethods
│       ├── lib/                Regras de negócio (auth, stock, shipping-quote, email…)
│       └── contexts, hooks, services, types, utils, constants
├── scripts/                    Utilitários locais (start_remoto.bat, remove_background.py)
├── assets/logos/               Logos originais da marca
└── README.md
```

Arquivos-chave em `site-chico/src/lib`: `auth.ts` (sessão), `stock.ts` (movimentação de estoque), `shipping-quote.ts` (cotação assinada), `email.ts` (Resend), `admin.ts` (autorização do painel), `maintenance-auth.ts` (segredo do cron), `rate-limit.ts`.

## 4. Primeiros passos

```bash
git clone https://github.com/iancancian/Site-Franci-s.git
cd Site-Franci-s/site-chico

npm install
cp .env.example .env          # preencha conforme a seção 5
npx prisma migrate deploy     # aplica as migrations em um MySQL vazio
npx prisma generate
npm run dev                   # http://localhost:3000
```

### Scripts (em `site-chico/`)

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (`next build --webpack`) |
| `npm start` | Executa o build de produção |
| `npm run lint` | ESLint |
| `npx tsc --noEmit --incremental false` | Checagem de tipos |

## 5. Variáveis de ambiente

Modelo completo em [`site-chico/.env.example`](./site-chico/.env.example). **Nunca versione o `.env`.**

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | URL de conexão MySQL (`mysql://usuario:senha@host:3306/banco`) |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL pública do site (HTTPS em produção) |
| `NEXT_PUBLIC_API_URL` | Sim | URL base da API (normalmente igual à do site) |
| `NEXTAUTH_URL` | Sim | URL pública usada pela configuração da aplicação |
| `NEXTAUTH_SECRET` | Sim | Assina sessões e cotações de frete. **Mínimo de 32 caracteres**, senão a aplicação lança erro. O nome é herdado; NextAuth não é usado |
| `CRON_SECRET` | Sim | Autoriza o endpoint de expiração de pedidos. **Mínimo de 32 caracteres** |
| `MP_ACCESS_TOKEN` | Para pagamento | Token de acesso do Mercado Pago |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Para pagamento | Chave pública do Mercado Pago |
| `MP_WEBHOOK_SECRET` | Recomendada | Valida a assinatura das notificações do webhook |
| `PIX_KEY` | Opcional | Chave PIX do negócio |
| `MELHOR_ENVIO_TOKEN` | Para frete | Token da API do Melhor Envio |
| `MELHOR_ENVIO_FROM_CEP` | Para frete | CEP de origem dos envios |
| `MELHOR_ENVIO_SANDBOX` | Para frete | `true` usa o ambiente sandbox; qualquer outro valor usa produção |
| `RESEND_API_KEY` | Para e-mail | Chave da API do Resend |
| `EMAIL_FROM` | Para e-mail | Remetente. Precisa ser de um **domínio verificado** no Resend (não funciona com `@gmail.com`) |
| `CONTACT_EMAIL` | Para e-mail | Destino das mensagens do formulário de contato |

Gere segredos aleatórios, por exemplo: `openssl rand -base64 32`.

## 6. Banco de dados

### Modelos (Prisma)

| Modelo | Descrição |
|---|---|
| `User` | Cliente ou administrador (`role`: `CUSTOMER` / `ADMIN`) |
| `EmailVerificationToken`, `PasswordResetToken` | Tokens de uso único |
| `Product` | Categorias `PIMENTA`, `MOLHO`, `KIT`; preço, estoque, peso e dimensões (usados no frete) |
| `Order`, `OrderItem`, `Payment` | Pedido, itens e pagamento |
| `Review` | Avaliações de produtos |
| `StockMovement` | Histórico de estoque (entrada, saída, perda, correção, reserva e liberação de pedido) |
| `ProductKitItemsArchive` | Tabela de arquivo, vazia |

### Migrations e catálogo inicial

- Migrations em `site-chico/prisma/migrations/` (8). Em produção use `npx prisma migrate deploy`; **não** use `migrate dev` nem `migrate reset` em bancos com dados.
- `site-chico/prisma/seed-products.sql` é um SQL com 6 produtos e 3 kits, **sem fotos e com estoque zero**. Revise preços e composição com o cliente antes de usar.
- O schema **não armazena a composição dos kits** (itens de cada kit).

## 7. Painel administrativo

Acesso em `/admin`, restrito a usuários com `role = ADMIN` **e** e-mail verificado; os demais recebem 404. Cada página e cada ação do servidor revalidam essa permissão.

| Seção | Recursos |
|---|---|
| Dashboard | Pedidos a enviar, pagamentos pendentes, produtos sem estoque, estoque baixo (limite: 5 unidades) e últimos pedidos |
| Produtos | Criar, editar e ocultar/exibir; foto por link (`imageUrl`) |
| Estoque | Entrada, saída, perda e contagem (ajuste para valor absoluto), com histórico |
| Pedidos | Filtros por status, detalhes, marcar como enviado (com código de rastreio) e entregue |

### Criar o primeiro administrador

Não há tela para isso, por segurança. Crie a conta pelo site, verifique o e-mail e execute no banco:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'email@do-dono.com';
```

## 8. Regras de negócio e fluxos

### Fluxo de compra

1. O cliente se autentica, preenche o endereço e o checkout consulta o ViaCEP.
2. `POST /api/shipping/calculate` cota o frete no Melhor Envio com peso e medidas dos produtos. A cotação é **assinada**, vinculada ao CEP e aos itens, e vale **15 minutos**.
3. `POST /api/orders` recalcula o subtotal com os **preços do banco** (nunca do navegador), valida o estoque e **reserva as unidades em transação**.
4. `POST /api/payment/mercadopago` cria a preferência de pagamento do pedido com chave de idempotência, e o cliente é redirecionado ao Mercado Pago.
5. `POST /api/payment/webhook` confere o pagamento na API do Mercado Pago e o valor do pedido. Aprovado: pedido confirmado. Recusado ou cancelado: estoque liberado.
6. O admin marca o pedido como enviado (com rastreio) e depois entregue; o cliente vê o status em `/minha-conta`.

### Pontos de atenção

- O **webhook é a fonte da verdade** do pagamento. As páginas `/checkout/sucesso` e `/pendente` são apenas informativas.
- Se a preferência de pagamento falhar, o pedido fica pendente para novas tentativas, e o estoque só é liberado pelo webhook ou pela expiração.
- `POST /api/maintenance/expire-orders` cancela pedidos pendentes antigos (parâmetro `minutes` de 5 a 1440, padrão 30; até 100 por execução) e devolve o estoque. Precisa de um **cron externo** (ver seção 10).
- Toda reserva e liberação de estoque gera um registro em `StockMovement`.
- O limitador de requisições é **em memória do processo**: não é compartilhado entre instâncias.
- Estorno e chargeback após pedido confirmado não têm tratamento definido.

## 9. Referência da API

| Método e rota | Auth | Função |
|---|---|---|
| `POST /api/auth/register` | — | Cadastro |
| `POST /api/auth/login` · `POST /api/auth/logout` | — | Entrar e sair |
| `GET /api/auth/session` | Cookie | Usuário da sessão |
| `GET /api/auth/verify-email` · `POST /api/auth/resend-verification` | — | Verificação de e-mail |
| `POST /api/auth/forgot-password` · `POST /api/auth/reset-password` | — | Recuperação de senha |
| `PATCH /api/account/profile` | Cookie | Editar nome, e-mail e telefone |
| `GET /api/products` · `GET /api/products/[slug]` | — | Catálogo |
| `POST /api/products/[slug]/reviews` | Cookie | Avaliar produto |
| `POST /api/shipping/calculate` | — | Cotação de frete |
| `GET /api/orders` · `GET /api/orders/[id]` | Cookie | Pedidos do cliente |
| `POST /api/orders` | Cookie | Criar pedido e reservar estoque |
| `POST /api/payment/mercadopago` | Cookie | Criar pagamento |
| `POST /api/payment/webhook` | Assinatura MP | Notificações do Mercado Pago |
| `POST /api/payment/pix` | — | Desativado (503) |
| `POST /api/contact` | — | Formulário de contato |
| `POST /api/maintenance/expire-orders` | `CRON_SECRET` | Expira pedidos pendentes |

O painel `/admin` usa server actions (`src/app/admin/actions.ts`), não rotas de API.

## 10. Deploy e operação

1. Provisione MySQL 8 e uma hospedagem Node.js 20.9+ com HTTPS.
2. Configure as variáveis da seção 5 no painel da hospedagem.
3. Execute `npx prisma migrate deploy`, `npm run build` e `npm start` em `site-chico/`.
4. No Mercado Pago, cadastre a URL do webhook: `https://SEU-DOMINIO/api/payment/webhook`.
5. Agende um cron chamando a expiração a cada poucos minutos:

```bash
curl -X POST "https://SEU-DOMINIO/api/maintenance/expire-orders" \
  -H "Authorization: Bearer $CRON_SECRET"
```

6. Configure **backup externo** do MySQL e teste a restauração em banco separado. Opções: backup gerenciado do provedor com snapshots/PITR; `mysqldump` agendado para S3, Backblaze B2 ou Cloudflare R2, criptografado e com credencial de mínimo privilégio.

Utilitários locais: `scripts/start_remoto.bat` (servidor com ngrok para demonstrações) e `scripts/remove_background.py` (tratamento de logos com Pillow). Ambos usam caminhos absolutos da máquina original e precisam de ajuste.

## 11. Pendências para o lançamento

Marque um item apenas depois de confirmá-lo no ambiente indicado.

### Bloqueadores

- [ ] **Homologação:** criar banco, credenciais sandbox e deploy separados da produção. Nenhuma compra de teste deve ser feita em produção.
- [ ] **E-mail:** verificar um domínio no Resend (DNS), definir `EMAIL_FROM` e testar verificação de conta, recuperação de senha e contato.
- [ ] **Frete:** validar a cotação em sandbox e produção (token, CEP de origem, serviços e prazos) e cadastrar peso e medidas reais dos produtos.
- [ ] **Pagamento:** obter com o cliente os dados da conta Mercado Pago; configurar credenciais e webhook; testar pagamento aprovado, recusado, cancelado e notificações repetidas.
- [ ] **Catálogo real:** nomes, descrições, preços, **fotos**, peso, dimensões e estoque.
- [ ] **Kits:** definir a composição com o cliente e modelar os itens do kit no schema.
- [ ] **Backup:** configurar backup externo e **testar a restauração**.
- [ ] **Deploy:** URLs HTTPS definitivas, domínio, DNS, certificado e URLs de retorno do Mercado Pago.
- [ ] **Cron:** agendar a expiração de pedidos e verificar a devolução de estoque.
- [ ] **Compra controlada em produção** (pagamento, webhook, status, frete e estoque) antes de divulgar.
- [ ] **Primeiro admin:** criar a conta do dono e promovê-la (seção 7).

### Funcionalidades a concluir

- [ ] E-mails transacionais de pedido, pagamento e envio. Enquanto não existirem, o site não deve prometê-los.
- [ ] Recuperação do carrinho após falha no pagamento (hoje é limpo ao redirecionar) e nova tentativa sem reservas duplicadas.
- [ ] Tratamento de estorno e chargeback.
- [ ] Upload de fotos no painel (hoje só link em `imageUrl`).
- [ ] Estoque de kits ligado aos itens (hoje cada kit tem estoque próprio).
- [ ] Limitador de requisições distribuído (ex.: Redis) se houver várias instâncias.
- [ ] Monitoramento de erros e responsável por incidentes.

### Conteúdo e jurídico

- [ ] Confirmar história e foto da página `/sobre`.
- [ ] Confirmar imagem Open Graph e favicon com a marca.
- [ ] Revisar Termos de Uso e Política de Privacidade (LGPD).
- [ ] Testar responsividade e acessibilidade.

## 12. Segurança

- Gere `NEXTAUTH_SECRET` e `CRON_SECRET` novos e aleatórios por ambiente e use credenciais distintas em homologação e produção.
- Use um usuário de banco com privilégios mínimos e senha forte.
- Nunca versione `.env`, dumps ou backups (o `.gitignore` já bloqueia esses arquivos).
- Preços e totais são sempre calculados no servidor; o webhook confere o valor pago.
- O histórico do git contém fotos antigas de produtos; se isso for um problema para um repositório público, será preciso reescrever o histórico.

## 13. Contato

- **WhatsApp:** (16) 99636-9876
- **Instagram:** @francis.molhos
- **E-mail:** contato@chicomolhos.com.br
