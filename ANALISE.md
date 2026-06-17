# Análise do Projeto — Franci's Creative Kitchen

> Gerado em: 15/06/2026 — Atualizado em: 16/06/2026

---

## 🔴 Crítico — Bloqueia o lançamento

1. ~~**Carrinho sem estado real**~~ — ✅ `CartContext` com `useReducer` implementado. Botão funcional em `ProductCard`, `FeaturedProduct` e página de produto.

2. ~~**Checkout com valor fixo hardcoded**~~ — ✅ Checkout lê total real do `CartContext`.

3. **Pagamento não integrado** — as rotas retornam mocks. Requer integração com gateway real (Stripe, PagSeguro, etc.). **Depende do cliente.**

4. **Login/Cadastro sem autenticação** — formulários sem submit real. `next-auth` não instalado. **Depende de decisão de stack (NextAuth, Clerk, etc.).**

5. **Produto dinâmico sem dados** — preço, rating e descrição ainda hardcoded. Sem `/api/products/[slug]`. **Depende de banco de dados.**

6. ~~**`params` não assíncrono no Next.js 15+**~~ — ✅ Corrigido com `async/await params` e `generateMetadata`.

---

## 🟡 Importante — Degradação de qualidade / UX ruim

7. ~~**`alert()` no checkout**~~ — ✅ Substituídos por `ToastContext` com componente visual.

8. ~~**`console.log` em produção**~~ — ✅ Removidos das rotas de pagamento.

9. **Duplicação de componentes** — ainda existem versões mortas em:
   - `src/components/Footer.tsx`, `FeaturedProduct.tsx`, `FeaturedProductsGrid.tsx`, `ProductCard.tsx`
   - `src/components/PaymentMethods/` (pasta inteira duplicada de `Payment/`)
   > Seguro remover tudo em `src/components/` raiz (exceto `index.ts`) e a pasta `PaymentMethods/`.

10. ~~**`<img>` HTML puro em vez de `next/image`**~~ — ✅ Migrado em `Navbar`, `Footer`, `LogoBanner`, `sobre/page.tsx`, `contato/page.tsx`.

11. ~~**Filtros de categoria sem funcionalidade**~~ — ✅ `PimentasGrid` e `MolhosGrid` com filtros por categoria funcionais.

12. **Busca no `Header` sem funcionalidade** — campo de pesquisa presente mas sem lógica. Requer decisão: busca client-side ou integração com API.

13. ~~**Contato com dados desatualizados/placeholder**~~ — ✅ Dados unificados via constante `CONTATO` usando os dados corretos do cliente.

14. ~~**`href="#"` em links obrigatórios**~~ — ✅ "Termos de Uso" e "Política de Privacidade" apontam para `/termos` e `/privacidade`.

15. ~~**Formulário de contato sem ação**~~ — ✅ Formulário controlado com `onSubmit`, validação e rota `/api/contact` implementada.

16. ~~**Avaliações hardcoded**~~ — ✅ `ReviewForm` com estrelas clicáveis, estado e toast. Falta apenas conectar a uma API.

17. ~~**`useAsync` com bug**~~ — ✅ Corrigido de `useState` para `useEffect`.

---

## 🔵 Padrão de mercado / Manutenibilidade

18. **Dados de produto hardcoded em todas as páginas** — arrays de produtos diretamente nos arquivos. Requer banco de dados ou CMS. **Depende do cliente.**

19. ~~**SEO incompleto**~~ — ✅ `metadata` adicionado em todas as páginas. `sitemap.ts` e `robots.ts` criados e funcionais.

20. **Sem `og:image`** — nenhuma página tem Open Graph image. Requer criação de imagens de compartilhamento.

21. **Imagens de produto faltando** — `public/products/` tem só 4 arquivos. Imagens referenciadas no carousel e grid causam 404. **Depende do cliente fornecer fotos.**

22. **`ProductGallery` usa emoji como placeholder** — galeria mostra 🌶️. **Depende das fotos reais.**

23. **`MercadoPagoForm.tsx` — código morto** — componente existe mas API retorna 410. Pode ser removido junto com a limpeza de duplicatas (item 9).

24. ~~**`FeaturedProductsGrid` usa `<a href>` em vez de `<Link>`**~~ — ✅ Corrigido.

25. ~~**Dados de contato inconsistentes entre arquivos**~~ — ✅ Unificados. Footer usa `contato@chicomolhos.com.br`.

26. **`Navbar.tsx` e `Header.tsx` coexistem** — `Navbar` é código morto (não usado pelo layout). Pode ser removido junto com a limpeza de duplicatas.

27. **Versão do Next.js** — `next: 16.1.7` é versão não-oficial. Monitorar estabilidade.

---

## ✅ O que está bem feito

- Estrutura de pastas com Route Groups `(com-banner)` bem organizada
- `tsconfig` com `strict: true` e paths configurados
- Componentes de pagamento com interface/props tipadas
- Design system com variáveis CSS (`--color-brand`, etc.)
- `WhatsAppButton` com link correto e acessível
- `HeroCarousel` com autoplay e pausa no hover funcional
- Constantes e tipos centralizados
- `.env.example` documentado
- `CartContext` + `ToastContext` implementados
- Carrinho totalmente funcional (add, remove, update qty)
- Checkout com total real do carrinho
- Filtros de pimentas e molhos funcionais
- `params` assíncrono corrigido na página de produto
- `sitemap.xml` e `robots.txt` gerados automaticamente
- Páginas `/termos` e `/privacidade` criadas (LGPD/CDC)
- `metadata` em todas as páginas
- Formulário de contato com API route e validação
- `console.log` de dados sensíveis removido
- `<img>` migrado para `next/image` nos componentes
- Build de produção passa com **zero erros** (22 rotas)

---

## 📋 O que falta para lançar

### 🔴 Funcionalidade core — requer decisões externas
- [ ] Integrar gateway de pagamento real (Stripe, PagSeguro ou Mercado Pago)
- [ ] Implementar autenticação (NextAuth.js ou Clerk)
- [ ] Criar banco de dados ou CMS para produtos (Supabase, PlanetScale, Sanity, etc.)
- [ ] Criar rotas API reais: `/api/products`, `/api/products/[slug]`, `/api/orders`
- [ ] Implementar cálculo de frete (Correios API ou Melhor Envio)

### 🟡 Conteúdo — requer entrega do cliente
- [ ] Fotos reais dos produtos (substituir placeholders e emojis)
- [ ] Texto da história da Franci's (`sobre/page.tsx` tem `[placeholder]`)
- [ ] Fotos da produção/da proprietária
- [ ] `og:image` para compartilhamento em redes sociais
- [ ] `favicon.ico` personalizado com a marca

### 🔵 Técnico — pode ser feito agora
- [ ] Remover componentes duplicados: pasta `src/components/` raiz (exceto `index.ts`) e pasta `src/components/PaymentMethods/`
- [ ] Remover `Navbar.tsx` (código morto — `Header.tsx` é o utilizado)
- [ ] Integrar envio de e-mail real na `/api/contact` (Resend, SendGrid, etc.)
- [ ] Implementar busca no Header (client-side ou Algolia)
- [ ] Configurar `.env.production` com domínio, chave PIX e secrets reais
