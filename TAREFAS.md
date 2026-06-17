# 📋 Tarefas Pendentes - Site Chico

## 💳 Pagamento (Prioridade Alta)

- [ ] **Instalar dependências de pagamento**
  ```bash
  npm install qrcode axios
  ```

- [ ] **Configurar variáveis de ambiente** (arquivo `.env.local`)
  ```
  PIX_KEY=sua_chave_pix_aqui
  DATABASE_URL=mysql://user:pwd@host/db
  NEXTAUTH_SECRET=seu_secret_aleatorio
  ```

- [ ] **Implementar PIX com QR Code Real**
  - Arquivo: `src/app/api/payment/pix/route.ts`
  - Integre com API de PIX (Braspag, etc)
  - Gere QR Code real usando biblioteca `qrcode`

- [ ] **Processar Pagamentos de Cartão**
  - Arquivo: `src/app/api/payment/process/route.ts`
  - Escolha processador: Stripe, Square, Braspag, etc
  - Implemente validação de dados sensíveis

- [ ] **Criar Models no Prisma**
  - Modelo `Order` (pedidos)
  - Modelo `Payment` (pagamentos)
  - Modelo `PaymentStatus` (status dos pagamentos)

## 🎨 Design & UX

- [x] **Atualizar paleta de cores**
  - Laranja primário: `#FF9900`
  - Black bars laterais: implementadas

- [ ] **Adicionar "Featured Products" Section**
  - Destaque para produtos em promoção
  - Integração com black bars
  - Animações de destaque

- [ ] **Criar componente de produto em destaque**
  - Componente `FeaturedProductCard.tsx`
  - Mostrar em homepage

## 🛒 Carrinho

- [ ] **Implementar Context API / Zustand para carrinho**
  - Persistir carrinho no localStorage
  - Sincronizar entre páginas

- [ ] **Criar componente de mini-carrinho**
  - Badge com quantidade
  - Preview ao hover

## 🔐 Autenticação

- [ ] **Configurar NextAuth.js**
  - Criar API de login
  - Implementar registro de usuários
  - Social login (Google, Facebook optional)

- [ ] **Criar página de login**
  - `src/app/login/page.tsx` (melhorar)
  - Validação de dados

- [ ] **Dashboard do cliente**
  - `src/app/minha-conta/page.tsx`
  - Histórico de pedidos
  - Dados pessoais

## 📦 Banco de Dados

- [ ] **Criar schema Prisma completo**
  - User
  - Product
  - Order
  - Payment
  - Cart

- [ ] **Migrations do banco**
  - Executar `npx prisma migrate dev`

## 📸 Imagens & Conteúdo

- [ ] **Receber logo do cliente**
- [ ] **Receber fotos dos produtos**
- [ ] **Otimizar imagens (WebP)**

## 🚀 Deploy & Produção

- [ ] **Configurar hosting na Hostinger**
  - Node.js app
  - Variáveis de ambiente

- [ ] **Configurar CI/CD**
  - GitHub Actions ou similar

- [ ] **Testes finais**
  - Pagamento em produção
  - Emails de confirmação

---

## 🎯 Próximas Reuniões

- **Métodos de pagamento**: Cartão + PIX ✅
- **Logo**: Aguardando cliente
- **Produtos**: Aguardando cliente
- **Chave PIX**: PREENCHIDA ✅
- **Processador de cartões**: Selecionar e configurar
