import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager - Organize suas tarefas',
  description: 'Um gerenciador de tarefas moderno com separação por projetos, cards dinâmicos e colaboração em tempo real.',
  keywords: ['task manager', 'gerenciador de tarefas', 'produtividade', 'organização'],
  authors: [{ name: 'Task Manager Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}