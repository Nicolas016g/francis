# Revisão técnica e prontidão para lançamento

> Revisado em: 30/10/2026
> Aplicação: `site-chico`

## Escopo e método

Esta revisão compara o estado atual do código e dos arquivos da aplicação com os itens deste relatório. Valores secretos não foram registrados. Em 30/10/2026, o banco configurado foi consultado e as migrations pendentes foram aplicadas após revisão do diff e criação de um dump lógico local. O responsável confirmou que esse banco é produção e que não existe ambiente de homologação. Painéis dos provedores, DNS, cron e fluxos externos não foram homologados.

Foram inspecionados o schema e as migrations Prisma, o seed, páginas, navegação, sitemap, APIs de catálogo, autenticação, pedidos, pagamento, frete, contato e manutenção, além dos scripts do `package.json` da aplicação. O estado final das migrations e os resultados das verificações locais estão registrados abaixo.

## Veredito

O código implementa um MVP com catálogo, kits, autenticação própria, pedidos, cotação de frete assinada, Checkout Pro do Mercado Pago, webhook, e-mails de conta/contato e expiração de pedidos pendentes. O banco consultado é de produção, conforme confirmação do responsável, mas não há ambiente de homologação. Isso não comprova prontidão para receber pagamentos reais: faltam validações no ambiente publicado, confirmação dos dados comerciais e testes controlados dos provedores.

### Estado verificável no código

| Área | Estado local |
|---|---|
| Aplicação e comandos | Next.js 16, React 19 e TypeScript; aplicação e scripts ficam em `site-chico` |
| Banco | Schema Prisma para usuários, tokens de verificação/recuperação, produtos, pedidos, itens, pagamentos e avaliações |
| Migrations | As 7 migrations locais estão aplicadas no banco MySQL `site_chico`; `prisma migrate status` confirmou schema atualizado |
| Catálogo | Banco consultado: 6 produtos (3 PIMENTA, 3 MOLHO), nenhum KIT e estoque total zero; o seed contém 6 produtos individuais e 3 kits, todos com estoque zero |
| Página de kits | `/kits` implementada, disponível na navegação e incluída no sitemap |
| Busca | Cabeçalho encaminha para `/busca`; resultados usam a mesma consulta compartilhada com a API de produtos |
| Compartilhamento e ícone | Imagem Open Graph gerada pela aplicação; `src/app/favicon.ico` já existe |
| Autenticação | Rotas de cadastro, login, logout, sessão, verificação de e-mail e redefinição de senha; sessão própria em cookie HttpOnly assinado |
| Pedidos | Criação exige sessão, consulta preços no banco, valida estoque e reserva unidades em transação |
| Pagamento | Preferência Mercado Pago vinculada a pedido persistido e criada com chave de idempotência |
| Webhook | Consulta o pagamento ao provedor, valida assinatura quando configurado e compara o valor com o pedido |
| Frete | A rota chama a API do Melhor Envio (`/api/v2/me/shipment/calculate`) usando token e modo sandbox/produção; cotação usa peso/dimensões do banco e token assinado vinculado a CEP/itens, com expiração de 15 minutos |
| Expiração | Endpoint protegido processa até 100 pedidos por execução; parâmetro `minutes` aceita de 5 a 1440 (padrão 30) |
| Contato | Envio pelo Resend, validação de campos, escaping de HTML e limite em memória do processo |
| PIX direto | Endpoint indisponível (`503`); o checkout oferece apenas Mercado Pago Checkout Pro, que pode apresentar PIX conforme as formas habilitadas na conta Mercado Pago |
| Painel do responsável | Não há painel administrativo nem API de manutenção de produtos/estoque; `stockQuantity` é usado no catálogo e reservado/liberado no fluxo de pedidos |

O seed define imagens usando os arquivos WebP presentes em `public/products`, mas não foi executado no banco consultado. As descrições de kits citam “Pequimenta” e “Relish de Pepino”, produtos que não aparecem entre os nove registros do seed; confirme a composição comercial antes de divulgar. O schema não armazena os itens de cada kit separadamente.

## Fluxos e limites importantes

### Conta e e-mail

As rotas de autenticação estão em `src/app/api/auth`. O código exige confirmação de e-mail antes da sessão, oferece reenvio e recuperação com tokens de uso único, e protege a página de conta. O envio real depende de configuração e validação do Resend no ambiente publicado.

O limitador atual usa memória do processo. Em hospedagem com várias instâncias ou funções efêmeras, esse estado não é compartilhado; adote armazenamento distribuído antes de depender dele como proteção global.

### Pedido, pagamento e estoque

`POST /api/orders` exige sessão, recebe produtos por slug, usa preço do banco, valida estoque e uma cotação de frete assinada, e cria pedido/pagamento pendentes enquanto reserva estoque. A preferência do Mercado Pago usa o pedido existente e uma chave idempotente.

Se a criação da preferência falhar, o pedido permanece pendente para permitir retry seguro. O estoque não é liberado imediatamente nesse caso: depende do webhook ou do endpoint de expiração. O webhook pode ser repetido sem processar novamente transições já concluídas; pagamento aprovado confirma o pedido e rejeição/cancelamento de uma transação pendente libera o estoque. O tratamento de estorno e chargeback após confirmação precisa ser homologado e definido antes de oferecer suporte a esses cenários.

O endpoint `POST /api/maintenance/expire-orders` cancela pedidos e pagamentos pendentes mais antigos que o limite configurado e devolve o estoque em transação. A existência da rota não configura nem comprova a execução periódica de um cron.

### Frete e comunicação

O código chama a API do Melhor Envio para cotar os serviços disponíveis, com `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_SANDBOX` e CEP de origem. Portanto, a integração está implementada no código; isso não comprova que as credenciais e o CEP de produção estejam válidos nem que uma cotação real tenha sido homologada.

O responsável informou que o e-mail está configurado via Resend. O código usa Resend para contato, verificação de conta e recuperação de senha, mas não envia confirmação de pedido/pagamento nem atualizações de envio. O recebimento de mensagens de teste, a chave e o domínio remetente precisam ser validados no ambiente publicado.

### Fluxo de compra: validação do código

1. O checkout exige conta autenticada, coleta endereço e usa ViaCEP para tentar preencher parte dos campos.
2. `POST /api/shipping/calculate` busca produtos ativos no banco, calcula pacote com peso/dimensões e consulta o Melhor Envio. A cotação devolvida é assinada, vinculada ao CEP e aos itens e válida por 15 minutos.
3. `POST /api/orders` recalcula subtotal com preços do banco, verifica estoque e reserva as unidades em transação; o custo/serviço de frete vem da cotação assinada.
4. `POST /api/payment/mercadopago` cria preferência Checkout Pro para o pedido existente, com chave idempotente. O usuário é redirecionado ao Mercado Pago.
5. O webhook consulta o pagamento na API do Mercado Pago, confere o total e processa transições pendentes; não depende apenas da URL de retorno do navegador. O status também pode ser consultado em `Minha Conta`.

Limites e pendências verificados:

- As páginas de retorno de sucesso/pendente são informativas; não consultam nem confirmam o pagamento. O webhook é a fonte de atualização do status. Os textos foram ajustados para não prometer aprovação nem e-mail que o código não envia.
- O carrinho é limpo ao iniciar o redirecionamento. Se o cliente voltar por falha/cancelamento, a página oferece retornar ao carrinho, mas os itens podem já ter sido removidos. Definir e testar recuperação do carrinho e uma nova tentativa sem criar reservas duplicadas.
- Se a API criar a preferência sem retornar `initPoint` nem `sandboxInitPoint`, o checkout agora mantém o carrinho e avisa que o pedido foi preservado, em vez de limpar o carrinho silenciosamente.
- Não há e-mail transacional após aprovação, recusa/cancelamento ou envio; implementar com tratamento idempotente para notificações repetidas do webhook.
- O schema prevê estados `SHIPPED`/`DELIVERED` e referência de envio, mas não há painel/rotina para atualizar esses estados, comprar etiqueta ou informar rastreio ao cliente.
- Estorno/chargeback depois da aprovação não é refletido corretamente: o webhook só altera pagamento enquanto ambos pedido e pagamento estão pendentes. Definir reconciliação e efeito sobre estoque antes de aceitar vendas reais.
- O Mercado Pago permite até seis parcelas na preferência; confirmar com o responsável se essa condição comercial é desejada e quais meios/parcelas estão habilitados na conta.

### Operação de produtos e estoque para o responsável

Hoje não existe painel para o dono gerenciar o catálogo. A proposta é uma área privada, responsiva e simples (por exemplo, `/admin`), com login/recuperação e autorização por papel de administrador no servidor, sem confiar apenas em esconder links na interface. O painel deve permitir cadastrar/editar/desativar produtos, atualizar fotos/preço/dimensões e consultar quantidade disponível.

Para manter histórico confiável, registrar cada entrada, ajuste, perda/avaria e correção de estoque em movimentos com produto, variação da quantidade, motivo, responsável e data; vendas e cancelamentos devem continuar registrados pelo próprio fluxo transacional de pedidos. Mostrar saldo atual, alertas de estoque baixo e histórico de movimentações. Mudanças de catálogo e estoque devem validar dados no servidor e não permitir que um usuário comum acesse as rotas administrativas. Antes de construir, confirmar com o dono quais campos e ações precisa operar e quem terá acesso.

## Configuração para homologar

Os nomes abaixo são lidos pelo código; nenhum valor secreto foi registrado neste relatório:

- Banco: `DATABASE_URL`.
- Sessão e assinatura da cotação: `NEXTAUTH_SECRET` (mínimo de 32 caracteres) e `NEXTAUTH_URL`.
- URL pública: `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_API_URL`. A URL da API e a de autenticação usam `http://localhost:3000` como fallback no código; configure URLs públicas com HTTPS.
- Mercado Pago: `MP_ACCESS_TOKEN`, `NEXT_PUBLIC_MP_PUBLIC_KEY` e `MP_WEBHOOK_SECRET`. Em produção, configure o segredo do webhook; sem ele, o código rejeita a assinatura.
- Melhor Envio: `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_SANDBOX` e `MELHOR_ENVIO_FROM_CEP`. Use credenciais de produção e `MELHOR_ENVIO_SANDBOX=false` somente após homologar.
- E-mail: `RESEND_API_KEY`, `EMAIL_FROM` e, se diferente do padrão, `CONTACT_EMAIL`.
- Expiração de pedidos: configure `CRON_SECRET` (mínimo de 32 caracteres) e um cron que envie o segredo no header `Authorization` com esquema Bearer ou no header `x-cron-secret`.

Nunca versionar arquivos de ambiente nem registrar valores secretos em logs, relatórios ou mensagens. Rotacione credenciais se houver confirmação de que foram expostas e mantenha-as somente no gerenciador de segredos da hospedagem.

## Pendências antes do lançamento

Os itens estão organizados em ordem operacional no checklist final deste documento. Como o banco já é produção, as próximas prioridades são backups verificáveis, homologação isolada e validação dos fluxos externos.

## Validação local

Execute os comandos na pasta `site-chico`:

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

**Resultado local:** lint, TypeScript e build passaram após as alterações; a compilação reconheceu `/busca`, `/kits` e `/opengraph-image`, sem warnings de `metadataBase`. O componente de cartão legado não tinha imports na aplicação e foi removido.

**Banco consultado em 30/10/2026:** MySQL 8, schema `site_chico`, acessado pela configuração local. `remove_kits` consta aplicada em 16/09/2026; inicialmente três migrations posteriores estavam pendentes. O diff do Prisma continha somente adicionar `Order.checkoutKey`, reabilitar `KIT` no enum e criar `ProductKitItemsArchive`. Após um dump lógico local, essas três migrations foram aplicadas; `prisma migrate status` confirmou schema atualizado, `checkoutKey` presente, enum incluindo `KIT` e tabela de arquivo criada. Nenhum seed foi executado.

**Limite de recuperação:** o banco tinha seis produtos (3 PIMENTA, 3 MOLHO), todos com estoque zero; não havia produtos KIT nem coluna `Product.kitItems`. A tabela de arquivo está vazia. O binlog está habilitado com retenção configurada de 30 dias, mas não foi possível listar os arquivos de binlog com a permissão atual; a migration foi aplicada em 16/09, mais de 30 dias antes desta revisão. O seed e a aplicação versionados não preenchiam nem usavam `kitItems`, mas não é possível excluir alterações manuais antigas. O dump local feito agora registra o estado atual e não recupera dados já removidos.

A validação local e as migrations aplicadas não substituem testes de credenciais, homologação externa nem teste completo no domínio publicado. Não execute o seed sem confirmar preços, composição e estoque com o responsável.

## Checklist de lançamento do e-commerce

Marque cada item somente depois de confirmar o resultado no ambiente indicado. O código local não comprova configuração ou funcionamento em produção.

### 1. Banco e catálogo — começar por aqui

- [x] Confirmar com o responsável que o banco `site_chico` é de produção. Não existe ambiente de homologação; preparar um banco separado antes de testes que criem pedidos ou alterem dados.
- [x] Criar dump lógico local do estado atual antes das migrations de 30/10/2026 (9 tabelas; ACL local restrita). Este dump **não** contém o `kitItems` removido em 16/09 e não substitui backup externo/off-site.
- [ ] Configurar backup externo/off-site e testar restauração; o dump atual é local e não havia backup anterior.
- [ ] Identificar o provedor/host MySQL e confirmar disponibilidade de snapshots automáticos e recuperação point-in-time.
- [ ] Avaliar se há outra fonte para eventuais valores manuais de `Product.kitItems`. A coluna não existe desde 16/09; o seed versionado não a preenchia e não foi encontrado uso do campo na aplicação. `ProductKitItemsArchive` foi criada, mas está vazia (0 linhas).
- [x] Aplicar as três migrations pendentes após revisão do diff; `prisma migrate status` confirmou as 7 migrations aplicadas.
- [ ] Validar a carga do catálogo: nomes, descrições, preços, fotos, dimensões, pesos, composição dos kits e estoque real. O banco consultado contém seis produtos e estoque total zero.
- [ ] Testar leitura do catálogo e uma compra de teste após a atualização do banco.

### 2. Configuração e conteúdo público

- [ ] Criar ambiente de homologação isolado com banco próprio e credenciais sandbox; nunca usar o banco de produção para testes de compra.
- [ ] Configurar no painel da hospedagem as URLs HTTPS definitivas (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` e `NEXTAUTH_URL`) e um `NEXTAUTH_SECRET` forte.
- [ ] Conferir domínio, DNS, certificado HTTPS e URLs de retorno do Mercado Pago.
- [ ] Confirmar história e foto da página `/sobre` com o responsável pelo negócio.
- [ ] Confirmar com a marca a imagem Open Graph gerada e o favicon existente.
- [ ] Revisar termos de uso e política de privacidade com o responsável.

### 3. E-mail, frete e pagamento

- [ ] **Resend:** verificar um domínio próprio no Resend (DNS) e trocar `EMAIL_FROM` para um endereço nesse domínio. A chave de API é válida (e-mail de teste enviado em 30/10 via `onboarding@resend.dev`), mas `EMAIL_FROM` atual é `@gmail.com`, recusado com 403; enquanto isso, verificação de conta, recuperação de senha e contato falham.
- [x] Cotação do Melhor Envio testada em modo produção com CEP de origem configurado: HTTP 200 com PAC, SEDEX, Jadlog, Loggi, JeT, Azul, LATAM e outros (SP, 500 g, 12×11×16 cm). Falta conferir peso/medidas reais de cada produto.
- [ ] Configurar `MP_ACCESS_TOKEN`, chave pública e `MP_WEBHOOK_SECRET` no painel da hospedagem.
- [ ] Cadastrar a URL pública do webhook e testar em sandbox pagamentos aprovados, recusados, cancelados e notificações repetidas.
- [ ] Definir e testar o procedimento para estornos e chargebacks após pedido confirmado.
- [ ] Fazer uma compra de ponta a ponta em homologação e confirmar pagamento, atualização do pedido, retorno do navegador, frete, reserva/liberação do estoque e recuperação após falha.
- [ ] Implementar e testar e-mails transacionais de pedido/pagamento e atualizações de envio, ou remover promessas dessas comunicações do site.
- [x] Atualização de envio/rastreio: painel `/admin/pedidos` (confirmado → enviado → entregue, com código de rastreio) e `/minha-conta` mostra status em português e rastreio. Não envia e-mail ao cliente.

### 4. Operação e liberação

- [ ] Configurar `CRON_SECRET` no servidor e um cron autenticado para chamar `/api/maintenance/expire-orders`; verificar cancelamento e devolução de estoque.
- [x] Painel administrativo `/admin` (produtos, estoque com histórico, pedidos), papel `ADMIN` e tabela `StockMovement`; migration `20261030150000_admin_panel` aplicada. Falta: promover a conta do dono a ADMIN e testar com ele.
- [ ] Confirmar política de backup recorrente, monitoramento de erros e responsável por incidentes.
- [ ] Publicar a versão validada e repetir verificações essenciais no domínio público.
- [ ] Realizar uma compra controlada em produção e conferir o ciclo completo antes de anunciar a loja.

### Opções para backup externo do banco de produção

O host/provedor do MySQL ainda precisa ser identificado. Opções, da mais gerenciada à mais simples:

1. **Backup gerenciado do provedor:** ativar snapshots automáticos e, se disponível, point-in-time recovery. É a opção mais simples para operação; confirmar retenção, custo, região/conta e como restaurar em outra instância. Um snapshot mantido apenas no mesmo serviço não substitui cópia independente.
2. **Dump automático para armazenamento externo:** agendar `mysqldump`/ferramenta compatível em ambiente controlado e enviar o arquivo criptografado para armazenamento de objetos independente (por exemplo, S3, Backblaze B2 ou Cloudflare R2). Usar credenciais de privilégio mínimo, TLS, criptografia em repouso, política de retenção e alertas de falha; não guardar o dump no repositório ou no mesmo servidor da aplicação.
3. **Exportação manual recorrente:** serve como medida temporária, não como estratégia principal; depende de alguém executar, verificar o arquivo e armazená-lo fora do computador/servidor que hospeda o banco.

Em qualquer opção, documentar quem recebe alertas, frequência e retenção conforme o volume de pedidos, e testar a restauração em banco separado antes de confiar no backup. Como o banco é produção, criar homologação isolada e fazer backup externo verificado são as prioridades imediatas. O dump criado em 30/10 é apenas uma cópia local pré-migrations e não recupera `Product.kitItems`, removido em 16/09; a tabela de arquivo criada está vazia.

### Painel administrativo e frete (30/10/2026)

- **Acesso:** `/admin`, restrito a usuários com `role = ADMIN` e e-mail verificado (quem não tem recebe 404). Não há tela para criar admins; após o dono criar e verificar a conta, promover via `UPDATE User SET role='ADMIN' WHERE email='...'` com `prisma db execute`.
- **Recursos:** painel com pendências e estoque baixo; cadastro/edição de produtos; entrada, saída, perda e contagem de estoque (com histórico); ocultar/exibir produto; pedidos com envio e rastreio. Reservas e liberações de estoque dos pedidos também entram no histórico.
- **Limites:** sem upload de fotos (usa link de imagem); kits têm estoque próprio; composição dos kits não está no banco.
- **Frete:** a cotação é automática por CEP, peso e dimensões de cada produto (Melhor Envio); o cliente escolhe a opção e a cotação assinada vale 15 min. Para ajustar valores, corrigir peso/medidas dos produtos.
- **Backup:** não há `mysqldump` local, e não é possível enviar a cópia para armazenamento externo sem credenciais do usuário. Para homologar: gerar o dump → restaurar em um banco separado → comparar contagem de linhas das tabelas → conferir que o app sobe nesse banco.

### Primeiro passo iniciado nesta revisão

O banco `site_chico` é de produção, conforme confirmação do responsável, e não há homologação. As sete migrations estão aplicadas. O dump local criado antes das três últimas migrations não é backup externo e não contém a coluna `Product.kitItems`, já removida; `ProductKitItemsArchive` está vazia. O catálogo tem seis produtos e estoque total zero. **Prioridades:** identificar o host do MySQL, ativar backup externo e testar restauração, criar homologação isolada, validar dados comerciais e implementar uma forma segura para o dono operar produtos/estoque. A integração de frete Melhor Envio existe no código e Resend é informado como configurado, mas ainda faltam testes reais de entrega/cotação; pagamento e fluxo ponta a ponta também precisam ser homologados.
