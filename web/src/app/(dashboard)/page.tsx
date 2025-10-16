import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Task Manager</CardTitle>
          <CardDescription>
            Gerencie suas tarefas e projetos de forma eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Use a sidebar ao lado para navegar entre diferentes seções do
            aplicativo.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas Pendentes</CardTitle>
          <CardDescription>Você tem 5 tarefas pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center font-bold text-4xl text-muted-foreground">
            5
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projetos Ativos</CardTitle>
          <CardDescription>3 projetos em andamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-20 items-center justify-center font-bold text-4xl text-muted-foreground">
            3
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
