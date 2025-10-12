# Task Manager Frontend

Um frontend moderno para o sistema de gerenciamento de tarefas, construído com Next.js, TypeScript e shadcn/ui.

## 🚀 Tecnologias Utilizadas

- **Next.js 14+** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI construídos com Radix UI
- **Framer Motion** - Biblioteca de animações
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd task-manager/web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_APP_ENV=development
   ```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run lint:fix` - Corrige problemas do ESLint automaticamente
- `npm run type-check` - Verifica tipos TypeScript
- `npm run test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Páginas de autenticação
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── auth/             # Componentes de autenticação
│   └── animations/       # Componentes de animação
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
│   ├── api/             # Cliente HTTP e serviços
│   └── validations/     # Esquemas de validação
├── store/               # Gerenciamento de estado
├── types/              # Definições de tipos TypeScript
└── constants/          # Constantes e configurações
```

## 🎨 Componentes UI

O projeto utiliza shadcn/ui para componentes base. Os componentes disponíveis incluem:

- **Button** - Botões com variantes e estados de loading
- **Input** - Campos de entrada com validação
- **Card** - Contêineres de conteúdo
- **Form** - Componentes de formulário integrados com React Hook Form
- **Toast** - Notificações temporárias
- **Label** - Rótulos acessíveis

## 🔐 Autenticação

O sistema de autenticação inclui:

- **Login** - Autenticação com email e senha
- **Registro** - Criação de nova conta
- **Gerenciamento de Token** - Armazenamento seguro de tokens JWT
- **Redirecionamento Automático** - Proteção de rotas baseada em autenticação

### Fluxo de Autenticação

1. Usuário acessa página de login
2. Credenciais são validadas no frontend
3. Requisição é enviada para API backend
4. Token JWT é retornado e armazenado
5. Usuário é redirecionado para dashboard

## 📱 Design Responsivo

O projeto segue uma abordagem mobile-first:

- **Mobile (320px+)** - Design otimizado para celulares
- **Tablet (768px+)** - Layout adaptado para tablets
- **Desktop (1024px+)** - Experiência completa para desktop

### Características do Design

- **Tema Claro/Escuro** - Suporte completo a temas
- **Animações Suaves** - Micro-interações com Framer Motion
- **Acessibilidade** - Conformidade com WCAG 2.1 Level AA
- **Touch-Friendly** - Alvos de toque otimizados (44px mínimo)

## 🧪 Testes

O projeto inclui:

- **Testes Unitários** - Componentes e funções utilitárias
- **Testes de Integração** - Fluxos completos de usuário
- **Validação de Acessibilidade** - Verificações automáticas de a11y

Execute os testes:

```bash
npm run test
```

## 🚀 Deploy

### Build de Produção

```bash
npm run build
npm run start
```

### Variáveis de Ambiente de Produção

```
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_ENV=production
```

### Otimizações de Produção

- **Code Splitting** - Carregamento sob demanda
- **Image Optimization** - Otimização automática de imagens
- **Bundle Analysis** - Análise do tamanho do bundle
- **Security Headers** - Cabeçalhos de segurança

## 🔧 Configuração de Desenvolvimento

### VSCode Extensions Recomendadas

- TypeScript Importer
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag

### Configuração do Editor

O projeto inclui configurações para:
- `.vscode/settings.json` - Configurações do VSCode
- `.editorconfig` - Configurações do editor
- `.prettierrc` - Formatação de código

## 📋 Checklist de Funcionalidades

### ✅ Implementado

- [x] Configuração do projeto Next.js com TypeScript
- [x] Sistema de autenticação completo
- [x] Componentes UI com shadcn/ui
- [x] Validação de formulários com Zod
- [x] Gerenciamento de estado com Zustand
- [x] Animações com Framer Motion
- [x] Design responsivo mobile-first
- [x] Temas claro/escuro
- [x] Testes unitários básicos
- [x] Configuração de produção

### 📋 Próximos Passos

- [ ] Dashboard principal
- [ ] Gerenciamento de tarefas
- [ ] Funcionalidades de projeto
- [ ] Colaboração em tempo real
- [ ] Notificações push
- [ ] PWA (Progressive Web App)

## 📞 Suporte

Para suporte e dúvidas, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.