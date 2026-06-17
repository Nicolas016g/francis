# Planejamento — Site E-commerce de Pimentas e Molhos

> **Cliente:** Chico
> **Desenvolvedor:** Junior Dev
> **Hosting:** Hostinger com suporte a Node.js (Plano Business ou superior)
> **Data de início:** Março 2026

---

## Stack Definida

| Camada            | Tecnologia                        |
|-------------------|-----------------------------------|
| Framework         | Next.js 14+ (App Router)          |
| Estilização       | Tailwind CSS                      |
| Linguagem         | TypeScript                        |
| Banco de dados    | MySQL (Hostinger — já incluso)    |
| ORM               | Prisma                            |
| Autenticação      | NextAuth.js                       |
| Pagamento         | Mercado Pago API                  |
| Deploy            | Hostinger (Node.js)               |

### Por que esta stack?

- **Next.js** — full-stack em um só projeto, frontend + API routes
- **Tailwind CSS** — CSS rápido, sem sair do JSX
- **Prisma** — ORM moderno, tipado, fácil de usar com MySQL
- **MySQL na Hostinger** — banco já incluído no plano, sem custo extra
- **NextAuth.js** — autenticação completa com poucas linhas
- **Mercado Pago** — gateway mais usado e fácil de integrar no Brasil

---

## Identidade Visual

| Elemento   | Definição                        |
|------------|----------------------------------|
| Cor 1      | Laranja — `#FF9900`              |
| Cor 2      | Preto — `#1a1a1a`                |
| Cor 3      | Branco — `#ffffff`               |
| Logo       | A ser entregue pelo cliente      |
| Imagens    | A ser entregues pelo cliente     |

### Referências de Design

| Site | O que aproveitar |
|------|-----------------|
| [agloriosapimenta.com.br](https://www.agloriosapimenta.com.br) | Layout focado em produto, tom rústico/artesanal |
| [chillibrothers.com.br](https://www.chillibrothers.com.br/combos/para-presentear/) | Combos bem apresentados, CTA claro |
| [boccaneira.com.br](https://boccaneira.com.br/produtos/) | Fotografia limpa, loja bem organizada |

---

## Estrutura de Páginas

```
📄 / ..................... Home (Principal)
📄 /pimentas ............. Catálogo de Pimentas
📄 /molhos ............... Catálogo de Molhos
📄 /kits ................. Kits e Combos
📄 /sobre ................ Sobre o negócio
📄 /contato .............. Contato (WhatsApp, e-mail, Instagram)
📄 /login ................ Login / Cadastro
📄 /minha-conta .......... Área do cliente
📄 /carrinho ............. Carrinho
📄 /checkout ............. Pagamento
📄 /produto/[slug] ....... Página individual de produto
```

---

## Estrutura do Projeto

```
site-chico/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Home
│   │   ├── pimentas/page.tsx
│   │   ├── molhos/page.tsx
│   │   ├── kits/page.tsx
│   │   ├── sobre/page.tsx
│   │   ├── contato/page.tsx
│   │   ├── login/page.tsx
│   │   ├── minha-conta/page.tsx
│   │   ├── carrinho/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── produto/[slug]/page.tsx
│   │   └── api/                  ← API Routes (auth, produtos, pedidos)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   └── lib/
│       ├── prisma.ts             ← cliente Prisma
│       └── auth.ts               ← config NextAuth
├── prisma/
│   └── schema.prisma             ← modelos do banco
├── public/                       ← imagens, logo
├── .env.local                    ← variáveis de ambiente
└── PLANEJAMENTO.md
```

---

## Canais de Contato do Cliente

- 📱 WhatsApp / Telefone
- 📧 E-mail
- 📸 Instagram

---

## Planejamento por Etapas

### Etapa 1 — Setup e Esqueleto
- [x] Definir stack
- [x] Criar projeto Next.js + Tailwind + TypeScript
- [x] Montar estrutura de pastas e páginas
- [x] Construir Navbar e Footer
- [x] Criar páginas esqueleto para aprovação do cliente

### Etapa 2 — Identidade Visual
- [ ] Aguardar logo do cliente (PNG fundo transparente)
- [ ] Aplicar paleta Laranja / Preto / Branco
- [ ] Definir tipografia
- [ ] Aplicar logo no header

### Etapa 3 — Banco de Dados e Models
- [ ] Configurar MySQL na Hostinger
- [ ] Definir schema Prisma (Produto, Usuário, Pedido, Avaliação)
- [ ] Rodar migrations

### Etapa 4 — Páginas e Conteúdo
- [ ] Montar Home com banner e destaques
- [ ] Páginas de catálogo: Pimentas, Molhos, Kits
- [ ] Página individual de produto com avaliações
- [ ] Aguardar fotos e dados dos produtos do cliente
- [ ] Página de Contato e Sobre

### Etapa 5 — Funcionalidades
- [ ] Autenticação — Login / Cadastro com NextAuth.js
- [ ] Área do cliente (Minha Conta)
- [ ] Carrinho de compras (estado client-side)
- [ ] Sistema de avaliações (nota + comentário)
- [ ] Integração Mercado Pago
- [ ] E-mails automáticos de confirmação de pedido
- [ ] Botão flutuante de WhatsApp

### Etapa 6 — Ajustes Finais e Deploy
- [ ] Testar fluxo completo de compra
- [ ] Responsividade mobile
- [ ] SEO básico (metadata por página)
- [ ] Deploy na Hostinger
- [ ] Configurar domínio e SSL
- [ ] Entrega e treinamento básico ao cliente

---

## Checklist — O que pedir ao cliente

- [ ] **Logo** em PNG com fundo transparente
- [ ] **Fotos dos produtos** (fundo branco, boa iluminação)
- [ ] **Lista de produtos** com nome, descrição e preço
- [ ] **Dados para pagamento** — CPF ou CNPJ para cadastro no Mercado Pago
- [ ] **Registrar domínio** e contratar plano **Business** (ou superior) na Hostinger
- [ ] **Credenciais** de acesso ao painel da Hostinger

---

## Domínio

- [ ] A definir — registro será feito pelo cliente na Hostinger

---

## Observações

- Plano mínimo na Hostinger: **Business** (suporta Node.js para Next.js full-stack)
- Plano **Premium** só faz sentido se o site for estático (sem NextAuth, sem API routes e sem backend no Next)
- Mercado Pago é o gateway mais simples de integrar no Brasil
- Paleta Laranja + Preto + Branco — transmite calor, intensidade e elegância
- Logo e fotos são bloqueantes para as etapas 2 e 4 — cobrar do cliente com antecedência
