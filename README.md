# Franci's Creative Kitchen (Chico Pimenta) — E-commerce

Loja virtual de pimentas, molhos e kits artesanais. Este documento reúne o que é necessário para uma equipe técnica **assumir e concluir** o projeto: visão geral, arquitetura, como rodar, estado atual e o que falta para o lançamento.

> Estado em 03/11/2026. O repositório **não contém** credenciais, dados do banco nem fotos de produtos.

## 1. Visão geral

| Item | Detalhe |
|---|---|
| Aplicação | `site-chico/` (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4) |
| Banco | MySQL 8 via Prisma 6 (`site-chico/prisma`) |
| Autenticação | Própria: cadastro, login, verificação de e-mail, recuperação de senha; sessão em cookie HttpOnly assinado (`jose`, cookie `francis_session`) |
| Pagamento | Mercado Pago Checkout Pro + webhook (PIX direto está desativado) |
| Frete | Melhor Envio (cotação assinada, válida por 15 min) |
| E-mail | Resend (verificação, recuperação de senha, contato) |
| Hospedagem prevista | Hostinger (Node.js) |
| Contato do negócio | WhatsApp (16) 99636-9876 · Instagram @francis.molhos · contato@chicomolhos.com.br |

### Estrutura do repositório

```
├── site-chico/          Aplicação Next.js
│   ├── prisma/          schema.prisma, migrations, seed-products.sql
│   ├── public/          Logos e ícones (sem fotos de produtos)
│   └── src/
│       ├── app/         Rotas: páginas, /api, /admin, checkout
│       ├── components/  Common, Product, Payment…
│       ├── lib/         Regras de negócio (auth, stock, shipping-quote, email…)
│       └── …            contexts, hooks, services, types, utils
├── scripts/             Utilitários locais (start_remoto.bat, remove_background.py)
├── assets/logos/        Logos originais da marca
└── README.md            Este documento
```

### Páginas e rotas principais

- **Loja:** `/`, `/pimentas`, `/molhos`, `/kits`, `/produto/[slug]` (com avaliações), `/busca`, `/carrinho`, `/checkout` (+ `/sucesso`, `/pendente`, `/falha`), `/minha-conta`, `/login`, `/cadastro`, `/recuperar-senha`, `/sobre`, `/contato`, `/termos`, `/privacidade`. Há também `sitemap.xml`, `robots.txt` (bloqueia `/admin`) e imagem Open Graph gerada.
- **Painel administrativo (`/admin`):** dashboard, produtos (criar/editar/ocultar), estoque (entrada, saída, perda, contagem, com histórico), pedidos (envio, rastreio, entrega). Acesso só para `role = ADMIN` com e-mail verificado; as demais pessoas recebem 404.
- **API:** `src/app/api/` — `auth/*`, `account/profile` (editar nome, e-mail e telefone), `products` (+ `[slug]` e `[slug]/reviews`), `orders` (+ `[id]`), `shipping/calculate`, `payment/mercadopago`, `payment/webhook`, `payment/pix` (retorna 503, desativado), `contact`, `maintenance/expire-orders`.

### Modelo de dados (Prisma)

`User` (com `role` CUSTOMER/ADMIN), `EmailVerificationToken`, `PasswordResetToken`, `Product` (categorias PIMENTA, MOLHO, KIT; peso e dimensões usados no frete), `Order`, `OrderItem`, `Payment`, `Review`, `StockMovement` (histórico auditável de estoque), `ProductKitItemsArchive` (vazia).

## 2. Como rodar localmente

Requisitos: Node.js 20+, MySQL 8.

```bash
cd site-chico
npm install
cp .env.example .env        # preencha as variáveis (seção 3)
npx prisma migrate deploy   # aplica as migrations em um banco vazio
npx prisma generate
npm run dev                 # http://localhost:3000
```

Outros comandos: `npm run lint`, `npx tsc --noEmit --incremental false`, `npm run build`, `npm start`.

Catálogo inicial: `site-chico/prisma/seed-products.sql` (6 produtos e 3 kits, **sem fotos e com estoque zero**). Revise preços e composição com o cliente antes de usar.

### Criar o primeiro administrador

Crie a conta pelo site, verifique o e-mail e promova:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'email@do-dono.com';
```

Não há tela para promover administradores (decisão de segurança).

## 3. Variáveis de ambiente

Modelo completo em `site-chico/.env.example`. **Nunca versionar o `.env`.**

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão MySQL |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL` | URLs públicas (HTTPS em produção) |
| `NEXTAUTH_SECRET` | Assina a sessão e as cotações de frete; **mínimo de 32 caracteres** (a aplicação lança erro se for menor). O nome é herdado: a biblioteca NextAuth **não** é usada |
| `CRON_SECRET` | Autoriza `POST /api/maintenance/expire-orders` (header `Authorization: Bearer <segredo>` ou `x-cron-secret`); **mínimo de 32 caracteres** |
| `MP_ACCESS_TOKEN`, `NEXT_PUBLIC_MP_PUBLIC_KEY`, `MP_WEBHOOK_SECRET` | Mercado Pago |
| `PIX_KEY` | Chave PIX do negócio |
| `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_FROM_CEP`, `MELHOR_ENVIO_SANDBOX` | Frete (`true` = sandbox) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL` | E-mail |

## 4. Regras de negócio importantes

- **Pedido:** exige conta logada. O preço vem do banco (nunca do navegador). O estoque é validado e **reservado em transação**; cada reserva/liberação é registrada em `StockMovement`.
- **Frete:** calculado por CEP, peso e dimensões de cada produto. O cliente escolhe a opção; a cotação é assinada e vale 15 minutos. Peso e medidas corretos nos produtos são essenciais.
- **Pagamento:** o pedido é criado antes; a preferência do Mercado Pago usa chave de idempotência. O **webhook** é a fonte da verdade (confere o valor); as páginas de retorno são só informativas. Aprovado → pedido confirmado; recusado/cancelado → estoque liberado.
- **Expiração:** `POST /api/maintenance/expire-orders` (header com `CRON_SECRET`) cancela pedidos pendentes antigos e devolve o estoque; precisa de um cron externo.
- **Limitador de requisições:** em memória do processo; não é compartilhado entre instâncias.

## 5. Estado atual (o que já foi verificado)

- Lint, TypeScript e build passam; migrations (8) aplicadas no banco de desenvolvimento/produção atual.
- Cotação real no Melhor Envio testada em modo produção (HTTP 200 com PAC, SEDEX, Jadlog, Loggi e outros).
- Resend: a chave de API é válida; o envio com o `EMAIL_FROM` atual **falha** (ver pendências).
- Fluxo de compra completo e painel `/admin` **não foram testados de ponta a ponta** com pagamento real.

## 6. O que falta para lançar

Marque cada item apenas após confirmar no ambiente indicado.

### 6.1 Bloqueadores

- [ ] **E-mail:** verificar um domínio próprio no Resend (DNS) e definir `EMAIL_FROM` com endereço desse domínio (ex.: `contato@chicomolhos.com.br`). Hoje o remetente é `@gmail.com`, recusado com 403; sem isso, verificação de conta, recuperação de senha e contato não funcionam.
- [ ] **Pagamento:** obter com o cliente os dados da conta Mercado Pago e configurar `MP_ACCESS_TOKEN`, chave pública e `MP_WEBHOOK_SECRET`; cadastrar a URL do webhook; testar em sandbox aprovado, recusado, cancelado e notificações repetidas.
- [ ] **Ambiente de homologação:** não existe. O banco atual é de produção. Criar banco e credenciais sandbox separados antes de qualquer compra de teste.
- [ ] **Catálogo real:** nomes, descrições, preços, **fotos**, peso, dimensões e estoque. Hoje há 6 produtos com estoque zero e nenhum kit.
- [ ] **Kits:** a composição de cada kit não é armazenada (a coluna `kitItems` foi removida em 16/09/2026 e não é recuperável). Definir a composição com o cliente, possivelmente modelando os itens do kit no schema.
- [ ] **Backup:** configurar backup externo/off-site do MySQL e **testar a restauração** em banco separado. Identificar o provedor do banco e habilitar snapshots/PITR. Opções: backup gerenciado do provedor; `mysqldump` agendado para S3/Backblaze B2/Cloudflare R2, criptografado e com credencial de mínimo privilégio; exportação manual apenas como paliativo.
- [ ] **Deploy:** definir `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL` (HTTPS), `NEXTAUTH_SECRET` forte; conferir domínio, DNS, certificado e URLs de retorno do Mercado Pago.
- [ ] **Cron:** configurar `CRON_SECRET` e agendar chamada autenticada a `/api/maintenance/expire-orders`; verificar cancelamento e devolução de estoque.
- [ ] **Compra controlada em produção** (ciclo completo: pagamento, webhook, status, frete, estoque) antes de divulgar.

### 6.2 Funcionalidades a concluir

- [ ] E-mails transacionais de pedido, pagamento e envio (hoje não existem; o site não deve prometê-los).
- [ ] Recuperação do carrinho após falha/cancelamento no pagamento (o carrinho é limpo ao redirecionar) e nova tentativa sem reservas duplicadas.
- [ ] Procedimento e tratamento de estorno e chargeback após pedido confirmado.
- [ ] Upload de fotos de produtos no painel (hoje só link em `imageUrl`; depende do armazenamento da hospedagem).
- [ ] Limitador de requisições distribuído (ex.: Redis) se houver várias instâncias.
- [ ] Monitoramento de erros e responsável por incidentes.
- [ ] Revisar a lógica de itens de kit e estoque de kits (hoje têm estoque próprio, independente dos itens).

### 6.3 Conteúdo e jurídico

- [ ] Confirmar história e foto da página `/sobre`.
- [ ] Confirmar imagem Open Graph e favicon com a marca.
- [ ] Revisar Termos de Uso e Política de Privacidade (LGPD) com o responsável.
- [ ] Testar responsividade e acessibilidade nas páginas principais.

## 7. Segurança e boas práticas

- Credenciais anteriores já circularam em conversas e arquivos locais: **trocar** senha do banco, `NEXTAUTH_SECRET`, `CRON_SECRET` e tokens (Mercado Pago, Melhor Envio, Resend) antes do lançamento.
- Senha do banco atual é fraca para produção.
- O banco atual é de produção e acessível por usuário sem permissão de criar bancos; testes de restore exigem banco separado.
- Todas as ações do `/admin` revalidam o papel do usuário no servidor.
- O histórico do git contém fotos de produtos antigas; se o repositório for público e isso for um problema, reescrever o histórico.

## 8. Observações operacionais

- `scripts/start_remoto.bat` sobe o servidor local com ngrok para demonstração ao cliente; contém caminho absoluto da máquina original.
- `scripts/remove_background.py` processa logos (Pillow); também usa caminho absoluto.
- Next 16: `params` e `searchParams` são Promises; o build usa `--webpack`.
