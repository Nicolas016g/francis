# 🔐 Sistema de Login e Cadastro - Franci's Creative Kitchen

## 📋 Informações Necessárias

Antes de implementar o sistema de autenticação, você precisa fornecer:

1. **Acesso à dashboard da Hostinger?**
   - [ ] Sim, tenho acesso
   - [ ] Preciso acessar pela primeira vez

2. **Qual banco de dados contratou?**
   - [ ] PostgreSQL
   - [ ] MySQL
   - [ ] MariaDB
   - [ ] Outro: ___________

3. **Credenciais do Banco de Dados:**
   ```
   Host (URL do servidor):      ________________
   Username:                    ________________
   Password:                    ________________
   Nome do banco:               ________________
   Porta (padrão 3306/5432):    ________________
   ```

---

## ✅ O que o Plano Business Hostinger Oferece

- ✅ PostgreSQL/MySQL incluído
- ✅ Node.js suportado
- ✅ SSL grátis
- ✅ Backup automático
- ✅ 100GB+ storage
- ✅ Suporte técnico

---

## 🚀 Roadmap de Implementação

### **Fase 1: Configuração do Banco de Dados**
**Objetivo:** Conectar Next.js à Hostinger

- [ ] Criar banco de dados na Hostinger
- [ ] Obter credenciais de acesso
- [ ] Instalar Prisma ORM
- [ ] Configurar arquivo `.env.local`
- [ ] Criar schema de usuários

**Tecnologias:**
- Prisma ORM (ORM para Node.js)
- PostgreSQL/MySQL (Banco de dados)
- Dotenv (Variáveis de ambiente)

---

### **Fase 2: Autenticação com NextAuth.js**
**Objetivo:** Implementar sistema seguro de login

- [ ] Instalar NextAuth.js
- [ ] Configurar providers de autenticação
- [ ] Implementar hash de senhas (bcrypt)
- [ ] Criar tabelas no banco (users, sessions)
- [ ] Configurar JWT (JWT tokens)

**O que será feito:**
```
- Registro seguro com validação
- Login com email/senha
- Sessões de usuário
- Recuperação de senha
- Remember-me (estar logado 30 dias)
```

---

### **Fase 3: UI - Páginas de Autenticação**
**Objetivo:** Criar interfaces de login e cadastro

**Páginas a criar:**
1. `/cadastro` - Página de cadastro
   - Inputs: Nome, Email, Senha, Confirmar Senha
   - Validações em tempo real
   - Terms & Conditions checkbox
   - Botão "Cadastrar"

2. `/login` - Página de login
   - Inputs: Email, Senha
   - "Esqueceu a senha?" link
   - "Criar conta" link
   - Botão "Entrar"

3. `/minha-conta` - Dashboard protegido (apenas logados)
   - Dados do usuário
   - Histórico de pedidos
   - Endereço de entrega
   - Botão de logout

4. `/recuperar-senha` - Recuperação de senha
   - Video email para reset
   - Link com token temporário

---

### **Fase 4: Integração com E-commerce**
**Objetivo:** Conectar autenticação com compras

- [ ] Proteger rota `/checkout`
- [ ] Associar pedidos ao usuário logado
- [ ] Salvar carrinho por usuário
- [ ] Histórico de compras
- [ ] Wishlist (favoritos)

---

## 📐 Estrutura Técnica

### **Stack Tecnológico:**
```
Frontend:  Next.js 16 + React 19 + TypeScript
Autenticação: NextAuth.js
Banco de Dados: PostgreSQL/MySQL (Hostinger)
ORM: Prisma
Hash de Senhas: bcrypt
Tokens: JWT
```

### **Fluxo de Autenticação:**
```
1. Usuário preenche formulário de cadastro
2. Sistema valida dados
3. Senha é hasheada com bcrypt
4. Dados são salvos no banco
5. Sessão é criada (JWT token)
6. Token é armazenado em cookie seguro
7. Usuário é redirecionado para dashboard
```

### **Arquivo `.env.local` necessário:**
```env
# Banco de dados
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aleatoria-muito-grande"
NEXTAUTH_URL="http://localhost:3000" # ou seu domínio em produção
```

---

## 📦 Pacotes a Instalar

```bash
npm install next-auth prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs
```

---

## 📂 Estrutura de Pastas (será criada):

```
src/
├── app/
│   ├── cadastro/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── minha-conta/
│       └── page.tsx
├── api/
│   └── auth/
│       └── [...nextauth].ts
├── lib/
│   ├── auth.ts (configuração NextAuth)
│   └── db.ts (cliente Prisma)
└── components/
    └── Auth/
        ├── LoginForm.tsx
        ├── SignupForm.tsx
        └── ProtectedRoute.tsx

prisma/
├── schema.prisma (definição do banco)
└── migrations/
```

---

## 🔒 Checklist de Segurança

- [ ] Senhas hasheadas com bcrypt
- [ ] HTTPS/SSL ativado
- [ ] CSRF protection
- [ ] Rate limiting em login (evita brute force)
- [ ] Token JWT com expiração
- [ ] Cookies seguros (HttpOnly, Secure)
- [ ] Validação de email
- [ ] Proteção de rotas
- [ ] Logout ao expirar sessão

---

## 📅 Estimativa de Tempo

| Fase | Descrição | Tempo |
|------|-----------|-------|
| 1 | Configuração BD + Prisma | 30 min |
| 2 | NextAuth + Implementação | 1-2 horas |
| 3 | UI (Login/Cadastro/Conta) | 1-2 horas |
| 4 | Integração E-commerce | 1 hora |
| **Total** | **Sistema Completo** | **4-5 horas** |

---

## ⚠️ Próximos Passos

1. **Compartilhe as credenciais da Hostinger**
2. **Confirme qual banco de dados usa** (PostgreSQL/MySQL)
3. **Começaremos a montar o sistema**

Está pronto? 🚀
