# Task Management API

Uma API REST moderna para gerenciamento de tarefas, construída com Fastify, TypeScript, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática para JavaScript
- **Prisma** - ORM moderno para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas
- **Argon2** - Hash de senhas seguro
- **Docker** - Containerização

## 📋 Funcionalidades

- ✅ Autenticação de usuários com sessões seguras
- ✅ Registro de novos usuários
- ✅ Gerenciamento de perfis de usuário
- ✅ API documentada com Swagger/OpenAPI
- ✅ Validação de dados com Zod
- ✅ Hash seguro de senhas com Argon2
- ✅ Logs estruturados com Pino
- ✅ CORS configurado
- ✅ Health check endpoint

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- pnpm
- PostgreSQL
- Docker (opcional)

### Configuração

1. **Clone o repositório**

```bash
git clone <repository-url>
cd server
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
```

4. **Configure o banco de dados**

```bash
# Execute as migrações
pnpm prisma migrate dev

# (Opcional) Gere o cliente Prisma
pnpm prisma generate
```

5. **Execute o servidor**

```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build && pnpm start
```

## 🐳 Docker

Para executar com Docker:

```bash
# Suba os serviços
docker-compose up -d

# Execute as migrações
docker-compose exec app pnpm prisma migrate dev
```

## 📚 Documentação da API

A API está documentada com Swagger/OpenAPI. Após iniciar o servidor, acesse:

- **Swagger UI**: `http://localhost:3000/reference`
- **Health Check**: `http://localhost:3000/health`

### Endpoints

#### 🔐 Autenticação

| Método | Endpoint         | Descrição         | Autenticação |
| ------ | ---------------- | ----------------- | ------------ |
| POST   | `/auth/sign-in`  | Login do usuário  | ❌           |
| POST   | `/auth/sign-out` | Logout do usuário | ✅           |

#### 👤 Usuários

| Método | Endpoint          | Descrição                    | Autenticação |
| ------ | ----------------- | ---------------------------- | ------------ |
| POST   | `/users/register` | Registro de usuário          | ❌           |
| GET    | `/users/me`       | Perfil do usuário atual      | ✅           |
| GET    | `/users/:id`      | Perfil de usuário específico | ✅           |

#### 🏥 Sistema

| Método | Endpoint  | Descrição           | Autenticação |
| ------ | --------- | ------------------- | ------------ |
| GET    | `/health` | Status da aplicação | ❌           |

### Exemplos de Uso

#### Registro de Usuário

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "12345678"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "12345678"
  }'
```

#### Acessar Perfil (com sessão)

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Cookie: fono-session=your-session-token"
```

## 🗄️ Banco de Dados

### Schema

A API utiliza PostgreSQL com as seguintes tabelas:

- **users**: Armazena informações dos usuários
- **sessions**: Gerencia sessões de autenticação

### Diagrama do Banco de Dados

```mermaid
erDiagram
    User {
        string id PK "UUID"
        string name "Nome do usuário"
        string email UK "Email único"
        string password "Senha hasheada"
        datetime createdAt "Data de criação"
        datetime updatedAt "Data de atualização"
    }

    Session {
        string id PK "CUID"
        string userId FK "ID do usuário"
        datetime invalidatedAt "Data de invalidação"
        datetime createdAt "Data de criação"
        datetime updatedAt "Data de atualização"
    }

    User ||--o{ Session : "possui"
```

### Relacionamentos

- **User → Session**: Um usuário pode ter múltiplas sessões (1:N)
- **Session → User**: Cada sessão pertence a um usuário (N:1)

## 🔒 Segurança

- **Hash de Senhas**: Utiliza Argon2 para hash seguro das senhas
- **Sessões**: Sistema de sessões com tokens únicos
- **Validação**: Validação rigorosa de dados de entrada com Zod
- **CORS**: Configuração de CORS para segurança
- **Cookies**: Cookies seguros para autenticação

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
pnpm dev

# Build da aplicação
pnpm build

# Executar migrações
pnpm prisma migrate dev

# Reset do banco de dados
pnpm prisma migrate reset

# Visualizar banco de dados
pnpm prisma studio
```

### Estrutura do Projeto

```
src/
├── app.ts                 # Configuração da aplicação
├── server.ts             # Servidor principal
├── env.ts                # Configuração de ambiente
├── constants/            # Constantes da aplicação
├── lib/                  # Utilitários e bibliotecas
├── routes/               # Rotas da API
│   ├── hooks/           # Middlewares
│   └── plugin/            # Plugins do Fastify
└── types/                # Definições de tipos
```

## 📊 Monitoramento

A aplicação inclui:

- **Logs estruturados** com Pino
- **Health check** endpoint para monitoramento
- **Métricas de performance** do Fastify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

**Desenvolvido com ❤️ usando Fastify + TypeScript + Prisma**
