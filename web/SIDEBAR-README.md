# Sidebar no Estilo Notion

## 📋 O que foi implementado

Uma sidebar moderna e responsiva inspirada no Notion, com as seguintes características:

### ✨ Funcionalidades

- **Collapsible**: Pode ser expandida ou colapsada para modo ícone
- **Header com Workspace**: Seção superior com dropdown para trocar de workspace
- **Navegação Principal**: Links rápidos para busca, início, inbox, configurações
- **Menu Hierárquico**: Suporte para submenus e itens expansíveis (Projetos, Tarefas)
- **Footer com Perfil**: Informações do usuário com dropdown de opções
- **Badges**: Notificações visuais (ex: 3 itens no Inbox)
- **Tooltips**: Dicas visuais quando a sidebar está colapsada
- **Atalho de Teclado**: `Cmd/Ctrl + B` para alternar a sidebar
- **Totalmente Responsiva**: No mobile, a sidebar se transforma em um drawer/sheet

## 🎨 Estrutura de Arquivos

```
src/
├── components/
│   ├── app-sidebar.tsx          # Componente principal da sidebar
│   └── ui/                       # Componentes shadcn/ui (já existentes)
│       ├── sidebar.tsx
│       ├── dropdown-menu.tsx
│       ├── avatar.tsx
│       ├── button.tsx
│       └── ...
└── app/
    └── (dashboard)/
        └── layout.tsx            # Layout atualizado com SidebarProvider
```

## 🚀 Como Usar

A sidebar já está integrada no layout do dashboard e funcionará automaticamente em todas as páginas dentro do grupo `(dashboard)`.

### Personalizando os Itens de Menu

Edite o arquivo `src/components/app-sidebar.tsx`:

```typescript
// Navegação principal
const mainNavItems = [
  {
    title: "Buscar",
    icon: SearchIcon,
    url: "/search",
  },
  {
    title: "Inbox",
    icon: InboxIcon,
    url: "/inbox",
    badge: "3", // Adicione badges opcionais
  },
  // Adicione mais itens aqui
];

// Workspace com submenus
const workspaceItems = [
  {
    title: "Projetos",
    icon: InboxIcon,
    url: "/projects",
    isOpen: true, // Define se inicia expandido
    items: [
      { title: "Projeto A", url: "/projects/a" },
      { title: "Projeto B", url: "/projects/b" },
    ],
  },
  // Adicione mais seções aqui
];
```

### Adicionando Novos Ícones

Importe de `lucide-react`:

```typescript
import { CalendarIcon, FileIcon, UsersIcon } from "lucide-react";
```

### Personalizando Informações do Usuário

No footer da sidebar (`app-sidebar.tsx`), atualize:

```typescript
<Avatar className="size-8">
  <AvatarImage alt="User" src="/seu-avatar.png" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
<div>
  <span className="font-semibold">Seu Nome</span>
  <span className="text-xs">seu@email.com</span>
</div>
```

### Personalizando o Workspace

No header da sidebar:

```typescript
<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
  <span className="font-semibold text-sm">SL</span> {/* Suas iniciais */}
</div>
<div>
  <span className="font-semibold">Seu Workspace</span>
  <span className="text-xs">Workspace</span>
</div>
```

## 🎯 Comportamentos

### Desktop

- **Estado Expandido**: Mostra todos os textos e ícones
- **Estado Colapsado**: Mostra apenas ícones com tooltips
- **Toggle**: Clique no botão do header ou pressione `Cmd/Ctrl + B`

### Mobile

- A sidebar fica oculta por padrão
- Abre como um drawer lateral ao clicar no botão de menu
- Fecha automaticamente ao navegar

## 🎨 Customização de Estilo

A sidebar usa as cores do tema definidas em `app/globals.css`:

```css
--sidebar: /* Cor de fundo */
--sidebar-foreground: /* Cor do texto */
--sidebar-accent: /* Cor de hover/active */
--sidebar-accent-foreground: /* Texto em accent */
--sidebar-border: /* Cor das bordas */
```

### Variantes Disponíveis

```typescript
<Sidebar
  collapsible="icon" // "offcanvas" | "icon" | "none"
  variant="sidebar" // "sidebar" | "floating" | "inset"
/>
```

## 📱 Responsividade

- **Desktop (≥768px)**: Sidebar fixa lateral
- **Mobile (<768px)**: Drawer deslizante

## 🔧 Componentes Utilizados

- `Sidebar` - Container principal
- `SidebarProvider` - Contexto e estado
- `SidebarTrigger` - Botão de toggle
- `SidebarInset` - Área de conteúdo principal
- `SidebarMenu` - Lista de navegação
- `SidebarMenuButton` - Botões de menu
- `Collapsible` - Submenus expansíveis
- `DropdownMenu` - Menus de contexto
- `Avatar` - Foto do usuário

## 💡 Dicas

1. **Adicione tooltips**: Use a prop `tooltip` em `SidebarMenuButton` para melhor UX
2. **Use badges**: Mostre notificações com contadores
3. **Organize por grupos**: Use `SidebarGroup` para separar seções
4. **Suporte a deep links**: Os links funcionam com Next.js Link
5. **Adicione loading states**: Use `SidebarMenuSkeleton` durante carregamento

## 🐛 Troubleshooting

### A sidebar não aparece

- Verifique se `SidebarProvider` envolve seu layout
- Confirme que está dentro do grupo `(dashboard)`

### Ícones não aparecem

- Verifique se importou de `lucide-react`
- Confirme que o componente está dentro de `SidebarMenuButton`

### Estilos não aplicam

- Execute `pnpm run dev` novamente
- Limpe o cache do Next.js: `rm -rf .next`

## 📚 Recursos

- [Shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [Lucide Icons](https://lucide.dev/icons/)
- [Next.js App Router](https://nextjs.org/docs/app)
