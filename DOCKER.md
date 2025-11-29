# 🐳 Docker Setup

Este documento descreve como executar o projeto usando Docker.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Início Rápido

1. **Clone o repositório** (se ainda não fez)

```bash
git clone <repository-url>
cd c216-L1-task-manager
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Server Environment Variables
SECRET_KEY=your-secret-key-change-in-production
GOOGLE_EMAIL=your-email@gmail.com
GOOGLE_PASSWORD=your-app-password
BASE_FRONTEND_URL=http://localhost:3001

# Web Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Execute o Docker Compose**

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá:
- Criar e iniciar o banco de dados PostgreSQL
- Criar e iniciar o servidor da API (Fastify)
- Criar e iniciar a aplicação web (Next.js)
- Executar as migrações do Prisma automaticamente

## 📦 Serviços

O `docker-compose.yml` inclui os seguintes serviços:

### 🗄️ Database (db)
- **Imagem**: `postgres:17`
- **Porta**: `5432`
- **Volume**: `postgres_data` (persistência de dados)
- **Healthcheck**: Verifica se o PostgreSQL está pronto

### 🚀 Server (server)
- **Porta**: `3000`
- **Dependências**: Aguarda o banco de dados estar saudável
- **Migrações**: Executa automaticamente `prisma migrate deploy` na inicialização

### 🌐 Web (web)
- **Porta**: `3001` (mapeada para `3000` interno)
- **Dependências**: Aguarda o servidor estar disponível

## 🔧 Comandos Úteis

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f server
docker-compose logs -f web
docker-compose logs -f db
```

### Parar os serviços
```bash
docker-compose down
```

### Parar e remover volumes (⚠️ apaga dados do banco)
```bash
docker-compose down -v
```

### Reconstruir imagens
```bash
docker-compose build --no-cache
```

### Executar comandos dentro dos containers

```bash
# Executar migrações manualmente
docker-compose exec server pnpm prisma migrate deploy

# Acessar o shell do servidor
docker-compose exec server sh

# Acessar o shell do web
docker-compose exec web sh
```

### Verificar status dos serviços
```bash
docker-compose ps
```

## 🌍 Acessos

Após iniciar os serviços:

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/reference
- **Web App**: http://localhost:3001
- **Database**: localhost:5432

## 🔒 Variáveis de Ambiente

### Server (API)

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `PORT` | Porta do servidor | Não | `3000` |
| `DATABASE_URL` | URL de conexão do PostgreSQL | Sim | - |
| `SECRET_KEY` | Chave secreta para cookies/sessões | Sim | - |
| `GOOGLE_EMAIL` | Email do Gmail para envio | Sim | - |
| `GOOGLE_PASSWORD` | Senha de app do Gmail | Sim | - |
| `BASE_FRONTEND_URL` | URL base do frontend | Sim | - |

### Web (Next.js)

| Variável | Descrição | Obrigatório | Padrão |
|----------|-----------|-------------|--------|
| `API_URL` | URL da API (uso interno) | Sim | - |
| `NEXT_PUBLIC_API_URL` | URL pública da API | Sim | - |

## 🐛 Troubleshooting

### Erro de conexão com o banco de dados

Verifique se o serviço `db` está saudável:
```bash
docker-compose ps
```

Se não estiver, veja os logs:
```bash
docker-compose logs db
```

### Erro de migrações

Execute manualmente:
```bash
docker-compose exec server pnpm prisma migrate deploy
```

### Porta já em uso

Se as portas 3000, 3001 ou 5432 já estiverem em uso, altere no `docker-compose.yml`:

```yaml
ports:
  - "3002:3000"  # Altere a porta externa
```

### Rebuild necessário após mudanças no código

```bash
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas

- O banco de dados persiste dados em um volume Docker chamado `postgres_data`
- As migrações do Prisma são executadas automaticamente na inicialização do servidor
- O servidor usa `tsx` para executar TypeScript diretamente (sem build)
- O web usa o modo `standalone` do Next.js para otimizar o tamanho da imagem

