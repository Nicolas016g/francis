# Análise de lançamento — Franci's Creative Kitchen

> Atualizado em: 27/10/2026 — reavaliação para lançamento público

## Como esta auditoria foi feita

Foram revisados o schema Prisma, as quatro migrations, as rotas em `src/app/api`, as páginas de catálogo/checkout/conta, o `package.json`, a navegação e as ocorrências de `TODO`, mock, kits, webhook e persistência. Também foram executados `prisma migrate status`, `npx tsc --noEmit` e `npm run build`.

O código e o ambiente local foram reavaliados em 27/10/2026. Valores secretos não são registrados neste documento. Entrega de e-mail, frete, pagamento, banco e deploy ainda precisam de teste manual no ambiente público.

### Estado das variáveis de ambiente

O arquivo local contém credenciais configuradas, mas ainda está orientado para desenvolvimento em dois pontos: `NEXT_PUBLIC_API_URL` e `NEXTAUTH_URL` apontam para `localhost`, e `MELHOR_ENVIO_SANDBOX` está `true`. Além disso, `MP_WEBHOOK_SECRET` não está definido no ambiente local. Na Hostinger, usar as URLs públicas, `MELHOR_ENVIO_SANDBOX=false` e um segredo real para o webhook. O `CRON_SECRET` usado durante esta sessão deve ser rotacionado antes da produção, pois foi exposto no contexto operacional.

## Auditoria de credenciais

Validação executada em 25/09/2026 sem registrar ou expor os valores secretos:

| Serviço | Resultado | Observação |
|---|---|---|
| MySQL / Prisma | ✅ HTTP/CLI válido | `.env.local` alinhado ao usuário dedicado `site_chico`; 4 migrations em dia |
| Mercado Pago | ✅ HTTP 200 | Token aceito pelo endpoint de identidade |
| Resend | ✅ domínio verificado no painel | Falta teste de envio real com a API key configurada na Hostinger |
| Melhor Envio Sandbox | ❌ HTTP 401 na última validação | Token inválido, expirado ou não autorizado no sandbox |
| `EMAIL_FROM` | ✅ domínio confirmado | Usa `noreply@francismolhos.com.br` |

Os tokens de Mercado Pago, Melhor Envio e Resend apareceram em arquivos locais durante a configuração. Por segurança, devem ser rotacionados antes da produção, principalmente as credenciais que retornaram `401`. Nunca versionar `.env`, `.env.local` ou tokens. No Resend, a chave precisa ter permissão de envio e o domínio usado em `EMAIL_FROM` precisa estar verificado.

## Veredito atual

O projeto tem uma base visual funcional, APIs de catálogo/pedidos, autenticação, checkout idempotente e endpoint de manutenção. O build local com Webpack passa. A plataforma **ainda não está pronta para receber pedidos reais**: o deploy precisa ser repetido com o commit atualizado, a migration de produção precisa ser aplicada, o webhook precisa de segredo/teste, o frete precisa sair do sandbox e os fluxos externos precisam ser homologados.

## Estado técnico confirmado

| Área | Estado atual | Lançamento |
|---|---|---|
| Next.js / TypeScript | Compila com sucesso | ✅ |
| Prisma + MySQL local | 5 migrations no código; última ainda não aplicada no banco local | ⚠️ executar `prisma migrate deploy` |
| Catálogo | 6 produtos sem kits no banco; páginas consultam Prisma | ✅ local |
| API de produtos | Listagem, filtro, busca e detalhe por slug consultam Prisma | ✅ local |
| Cadastro e login | Prisma + bcryptjs + cookie HttpOnly assinado; confirmação de e-mail obrigatória | ✅ local |
| API de pedidos | Criar/listar/consultar pedidos com sessão e transação | ✅ local; validar sandbox |
| Checkout | Pedido idempotente, estoque reservado e preferência Mercado Pago idempotente | ✅ retry seguro; validar expiração de reservas |
| Mercado Pago | SDK, preferência idempotente, webhook com assinatura e conferência de valor | ⚠️ configurar `MP_WEBHOOK_SECRET`, URL e teste sandbox |
| PIX | Endpoint bloqueado com `503`; não é oferecido | ✅ lançamento rápido |
| Melhor Envio | Calcula usando peso/dimensões/preço do Prisma | ⚠️ token local em sandbox; validar credencial de produção |
| Contato | Resend centralizado, validação, rate limit e logs implementados | ⚠️ domínio verificado; testar API key e recebimento |
| Avaliações de produto | POST autenticado com upsert por usuário/produto | ✅ local |
| Avaliação da home | Formulário falso removido | ✅ |
| Minha conta | Sessão, perfil e histórico de pedidos | ✅ local |
| Lint | Sem erros ou avisos | ✅ |
| Build | `npm run build` com Webpack passa localmente | ⚠️ repetir deploy Hostinger com commit atualizado |

## Banco de dados

O schema em `prisma/schema.prisma` contém somente os modelos necessários ao fluxo atual:

- `User`: cliente, e-mail e hash da senha.
- `Product`: catálogo, preço, estoque, categoria e dimensões para frete.
- `Order`: pedido, valores, status e snapshot do endereço de entrega.
- `OrderItem`: produtos e preços praticados no momento da compra.
- `Payment`: status e identificador do pagamento no provedor.
- `Review`: avaliação única de um usuário para cada produto.

A migration está aplicada e o comando `prisma migrate status` confirmou que o banco local está atualizado com quatro migrations. A categoria `KIT` e o campo `kitItems` foram removidos. O schema também contém `EmailVerificationToken` e `PasswordResetToken`. O seed define seis produtos: Mostarda, Ketchup, Jalapeño, Dedo de Moça, Caseira e Barbecue, inicialmente com estoque zero. A quantidade atual deve ser conferida no MySQL Workbench/Prisma Studio antes de vender. Nenhuma tabela extra de carrinho ou endereço foi criada: o carrinho permanece temporário no navegador e o endereço será preservado dentro do pedido.

## Bloqueadores críticos

### 1. Autenticação e conta — código concluído; homologação pendente

Cadastro, login, logout e leitura de sessão já estão implementados em `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` e `/api/auth/session`. As senhas são armazenadas com `bcryptjs` e a sessão fica em cookie HttpOnly assinado. A confirmação obrigatória usa `/api/auth/verify-email` e `/api/auth/resend-verification`; recuperação usa `/api/auth/forgot-password` e `/api/auth/reset-password`. `/minha-conta` agora exige sessão no servidor. Ainda é necessário:

- [x] exigir confirmação de e-mail antes de criar sessão;
- [x] reenviar confirmação com token de uso único;
- [x] criar recuperação de senha com token de uso único e expiração;
- [x] adicionar rate limiting para login e cadastro;
- [x] salvar alterações do formulário de perfil;
- [x] proteger a criação e consulta de pedidos pela mesma sessão;
- [x] exibir pedidos reais dentro de “Minha conta”;
- [ ] configurar e testar `NEXTAUTH_SECRET`/`NEXTAUTH_URL` no ambiente público.

O envio efetivo depende de `RESEND_API_KEY`, `EMAIL_FROM` e domínio verificado no Resend. Sem essas variáveis, a conta é criada sem sessão, mas o e-mail não poderá ser entregue.

### 2. Finalizar o ciclo de pagamento e estoque — parcialmente concluído

`src/lib/prisma.ts` já existe. O webhook Mercado Pago valida assinatura quando `MP_WEBHOOK_SECRET` está configurado, consulta o pagamento, confere método e valor contra o pedido, atualiza `Payment`/`Order` e devolve estoque em rejeição/cancelamento. A criação do pedido usa `checkoutKey` único e a preferência usa uma chave de idempotência estável por pedido. Se a resposta do Mercado Pago for perdida, o pedido permanece pendente para retry, evitando pagamento aprovado em pedido cancelado. Ainda falta testar o webhook em sandbox e automatizar a expiração/liberação de reservas abandonadas.

Para lançamento rápido, use somente Mercado Pago Checkout Pro. O endpoint PIX está bloqueado até haver integração real.

### 3. Catálogo — tecnicamente interligado, conteúdo ainda incompleto

O seed inicial foi criado em `prisma/seed-products.sql` com Mostarda, Ketchup, Jalapeño, Dedo de Moça, Caseira e Barbecue. Os kits foram removidos conforme decisão do projeto. As APIs já existem:

- `GET /api/products`, com filtro de categoria e somente produtos ativos;
- `GET /api/products/[slug]`;
- páginas de pimentas, molhos, home e produto consultando o banco;
- remover ou redirecionar as páginas, menus, sitemap e componentes antigos de `/kits`.

O seed inclui nome, descrição, preço, imagens disponíveis, categoria, estoque, peso e dimensões. O estoque foi iniciado em `0` porque a quantidade real não foi informada; preencher antes de vender. As páginas bloqueiam o botão de compra quando `stockQuantity` é zero. A presença real de cada produto, quantidade e imagem deve ser confirmada manualmente no banco.

### Caminho atual do produto

O caminho está apenas parcialmente interligado:

```text
seed-products.sql
	-> MySQL Product
	-> GET /api/products ou GET /api/products/[slug]
	-> páginas server-side consultam Prisma
	-> cards recebem preço, slug, imagem e estoque do banco
	-> carrinho recebe os dados exibidos no catálogo
```

O catálogo está interligado. O checkout ainda precisa ser considerado não confiável até o webhook atualizar pagamento e estoque; o servidor já recalcula preços e estoque ao criar o pedido.

### APIs implementadas

```text
GET  /api/products
GET  /api/products/[slug]
POST /api/products/[slug]/reviews
GET  /api/orders
POST /api/orders
GET  /api/orders/[id]
GET  /api/shipping/calculate
```

`POST /api/orders` exige sessão, consulta produtos por slug, ignora preços enviados pelo navegador, valida estoque e cria `Order`, `OrderItem` e `Payment` em transação. O estoque é reservado na criação do pedido; é necessário implementar liberação em pagamento recusado/expirado no webhook.

### 4. Criar pedido antes de iniciar o pagamento

O checkout agora cria o pedido antes de iniciar o Mercado Pago. O servidor:

1. identificar o usuário pela sessão;
2. buscar os produtos no banco, sem confiar em preço enviado pelo navegador;
3. validar estoque e quantidade;
4. calcular subtotal e total no servidor;
5. salvar `Order`, `OrderItem` e `Payment` como pendentes;
6. reserva estoque dentro da transação;
7. cria a preferência usando o ID real do pedido e preços do banco.

### 5. Implementar confirmação do pagamento — implementado, falta teste externo

`POST /api/payment/webhook` valida assinatura em produção, consulta o pagamento no Mercado Pago, atualiza `Payment`/`Order` e evita devolver estoque duas vezes. Ainda é necessário cadastrar a URL no painel Mercado Pago e executar testes sandbox de aprovado, rejeitado, cancelado e repetido.

### 6. PIX — bloqueado até integração real

`/api/payment/pix` agora retorna `503` informando indisponibilidade. O checkout usa somente Mercado Pago Checkout Pro; não há QR Code falso disponível ao cliente.

## Validação passo a passo

### Passo 1 — Banco

**Validado:** schema presente, quatro migrations e `prisma migrate status` sem pendências; TypeScript e build passam.

**Validar manualmente:** abrir o banco no MySQL Workbench ou Prisma Studio e confirmar seis produtos, estoque real, imagens e preços. A consulta direta pelo Node puro não foi concluída porque o cliente Prisma gerado usa imports ESM internos sem extensão fora do bundler.

### Passo 2 — Catálogo

**Validado no código:** home, pimentas, molhos, detalhe e frete consultam Prisma; as APIs de produtos existem.

**Validar no deploy:** domínio público usado em sitemap/robots e presença das imagens definitivas. A rota de kits foi removida do app atual.

### Passo 3 — Cadastro e login

**Validado no código:** bcrypt, cookie HttpOnly assinado, confirmação, recuperação, rate limiting e perfil persistido.

**Validar manualmente:** criar conta com e-mail real, confirmar, sair, entrar e recuperar senha usando o domínio Resend já verificado.

### Passo 4 — Pedido

**Validado no código:** sessão obrigatória, produtos buscados por slug, preço recalculado no servidor, estoque decrementado em transação e pedido/pagamento criados.

**Tratamento implementado:** se a resposta da preferência do Mercado Pago for perdida, o pedido permanece pendente para retry idempotente. A expiração posterior é feita pelo endpoint protegido e devolve o estoque em transação.

### Passo 5 — Pagamento

**Validado no código:** preferência Mercado Pago vinculada ao `orderId`.

**Implementado no código:** existe `/api/payment/webhook`, com validação de assinatura em produção e atualização de `Payment`/`Order`. **Pendente:** configurar `MP_WEBHOOK_SECRET`, cadastrar a URL e executar o teste sandbox completo.

### Passo 6 — Frete

**Validado no código:** peso, dimensões, valor e produtos são lidos do banco.

A cotação retornada ao checkout agora é assinada no servidor, vinculada ao CEP e aos itens/quantidades do carrinho, e expira em 15 minutos. O endpoint de pedidos não aceita mais um frete arbitrário enviado pelo navegador.

Pedidos pendentes abandonados podem ser liberados pelo endpoint protegido `POST /api/maintenance/expire-orders`. A chamada exige `Authorization: Bearer $CRON_SECRET`, processa no máximo 100 pedidos por execução e aceita `?minutes=30` (mínimo de 5, máximo de 1440). A transação só devolve o estoque depois de alterar atomicamente o pagamento e o pedido, evitando disputa com o webhook.

**Validar manualmente:** token Melhor Envio, modo sandbox/produção, CEP de origem, CEP de destino e retorno de transportadoras. A última validação registrada retornou HTTP 401.

### Passo 7 — Comunicação

**Implementado no código:** `/api/contact` envia pelo Resend e só retorna sucesso após a API aceitar a mensagem. O domínio já foi verificado no Resend; falta validar a API key e o recebimento real na aplicação publicada.

**Validar manualmente:** confirmação e recuperação de senha com envio real pelo Resend.

Para liberar o contato em produção:

1. No Resend, adicionar e verificar o domínio usado em `EMAIL_FROM` (por exemplo, `francismolhos.com.br`).
2. Publicar no DNS os registros SPF, DKIM e, quando fornecido, DMARC pelo painel do Resend.
3. Criar uma API key com permissão de envio e configurar `RESEND_API_KEY` somente no ambiente da hospedagem.
4. Usar um remetente do domínio verificado, por exemplo `Franci's Creative Kitchen <noreply@francismolhos.com.br>`.
5. Configurar `CONTACT_EMAIL` como a caixa que receberá as mensagens.
6. Enviar um teste pelo formulário publicado e confirmar recebimento, `Reply-To` e ausência de spam.
7. Testar também cadastro, verificação de e-mail e recuperação de senha, pois usam a mesma configuração.

O endpoint de contato aceita nome até 100 caracteres, assunto até 150, mensagem até 5000 e e-mail até 254 caracteres. Há limite de cinco tentativas por IP a cada 15 minutos. Os dados enviados ao HTML são escapados antes do envio.

### Passo 8 — Qualidade

**Validado:** lint, TypeScript e build com Webpack passam localmente.

**Pendente:** o último deploy registrado usou uma versão anterior e falhou no Turbopack; é necessário confirmar que a Hostinger recebeu o commit com `"build": "next build --webpack"`. Há manifests duplicados na raiz do repositório, por isso o diretório da aplicação deve ser `site-chico`.

## Pendências importantes antes do lançamento

- Validar envio real do formulário de contato via Resend na aplicação pública.
- Testar confirmação/recuperação de senha com envio real pelo Resend.
- Configurar `MP_WEBHOOK_SECRET` e cadastrar/testar a URL pública do webhook.
- Aplicar as 5 migrations no banco de produção.
- Configurar cron para `POST /api/maintenance/expire-orders?minutes=30`.
- Gerar/autorizar token do Melhor Envio no ambiente de produção.
- Corrigir a busca do Header, que está apenas visual.
- Substituir imagens/emoji placeholders e preencher a história em `/sobre`.
- Corrigir link `href="#"` nos termos do cadastro.
- Validar e remover componentes duplicados restantes em `src/components/` depois de confirmar que não há imports.
- Configurar `NEXT_PUBLIC_SITE_URL` com o domínio definitivo e revisar `sitemap.ts`/`robots.ts`.
- Criar `og:image` e favicon definitivo.
- Corrigir/renovar token do Melhor Envio e validar cálculo com CEP, peso e dimensões reais.
- Confirmar `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_API_URL` no domínio público.
- Configurar `MP_WEBHOOK_SECRET` no ambiente de produção; o modelo está em `.env.example`.
- Definir URLs públicas sem `localhost`; a preferência do Mercado Pago usa a URL base nos retornos.
- Cadastrar e testar a URL do webhook Mercado Pago em sandbox.
- Testar liberação de estoque em rejeição, cancelamento e repetição de webhook.

## Qualidade e segurança

`npm run build`, `npx tsc --noEmit`, `prisma migrate status` e `npm run lint` passaram após as alterações desta auditoria. O warning de múltiplos lockfiles e a validação externa de credenciais ainda exigem revisão manual. O rate limit atual usa memória do processo; para múltiplas instâncias públicas, deve ser substituído por Redis ou armazenamento compartilhado.

As credenciais em `.env` e `.env.local` não devem ser commitadas. Como tokens e senha foram expostos no histórico da conversa, Mercado Pago, Melhor Envio, Resend e banco devem ser rotacionados antes da produção. Em produção, configurar as variáveis no painel da hospedagem.

Também há um aviso de múltiplos `package-lock.json`: o Next.js está inferindo `C:\Users\LOCAL_ADM\package-lock.json` como raiz. Remover o lockfile externo se ele não pertencer a outro projeto, ou configurar `turbopack.root` explicitamente.

## Checklist de lançamento

### Obrigatório

- [x] Cadastro, login, logout, sessão e hash de senha.
- [x] Confirmação de e-mail obrigatória e reenvio de token.
- [x] Recuperação de senha, rate limiting e edição persistida do perfil.
- [x] Singleton Prisma e APIs de leitura de produto.
- [x] Conectar páginas de catálogo, home, detalhe e frete ao banco.
- [ ] Estoque, preços e imagens reais confirmados no banco.
- [x] API de criação/listagem/consulta de pedidos com validação no servidor.
- [x] Cotação de frete assinada e vinculada aos itens do carrinho.
- [x] Criação de pedido idempotente por checkout e retry da preferência Mercado Pago.
- [x] Preferência Mercado Pago vinculada a pedido persistido.
- [x] Webhook rejeita notificações cujo valor não confere com o pedido.
- [x] Webhook Mercado Pago com idempotência básica e atualização de status.
- [x] PIX mock bloqueado para o lançamento rápido.
- [x] Liberar estoque se a preferência falhar ou o pagamento for rejeitado/cancelado.
- [x] Proteção de `/minha-conta`.
- [x] Proteção da API de pedidos e checkout por sessão.
- [x] Integração de e-mail de contato; falta teste com credencial/domínio válidos.
- [x] Lint sem erros.
- [ ] Variáveis de produção, domínio, SSL e banco da Hostinger configurados e conferidos.
- [ ] Teste completo em sandbox e depois teste controlado em produção.
- [x] Endpoint protegido para expirar pedidos pendentes abandonados.
- [ ] Cron da Hostinger configurado e testado para chamar o endpoint.
- [x] Endpoint protegido para expirar pedidos pendentes abandonados (`POST /api/maintenance/expire-orders`).

### Recomendado antes da divulgação

- [x] Avaliações persistidas.
- [x] Avaliação da home conectada à API ou removida.
- [x] Recuperação de senha.
- [ ] Busca funcional.
- [ ] Frete validado em produção.
- [ ] Conteúdo definitivo de `/sobre`.
- [ ] `og:image`, favicon e revisão de SEO.
- [ ] Backup e monitoramento de erros.

## Ordem recomendada

1. Reimplantar o commit atualizado com `next build --webpack` e diretório `site-chico`.
2. Aplicar as 5 migrations no banco de produção.
3. Configurar `MP_WEBHOOK_SECRET` e testar o webhook Mercado Pago.
4. Validar estoque real, imagens, preços e dados no banco.
5. Renovar/validar Melhor Envio em produção e testar Resend.
6. Confirmar URLs públicas, HTTPS, login e sessão.
7. Testar compra completa em sandbox e depois uma compra controlada.
8. Configurar um cron da Hostinger para chamar periodicamente:

   ```bash
   curl -X POST "https://francismolhos.com.br/api/maintenance/expire-orders?minutes=30" \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

## Conclusão

O projeto está em estágio de **MVP funcional com banco, catálogo, autenticação, pedidos, webhook e lint prontos**, mas ainda não em estágio de cobrança comercial validada. O caminho para lançamento é: configurar/testar Mercado Pago sandbox → confirmar estoque/dados → validar Melhor Envio/Resend → definir infraestrutura distribuída → rotacionar segredos → produção controlada.