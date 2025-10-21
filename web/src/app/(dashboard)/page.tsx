import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="space-y-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50 transition-colors duration-300 hover:bg-muted">
            <FolderOpen
              className="size-10 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-3">
            <h1 className="font-semibold text-2xl tracking-tight">
              Nenhum workspace selecionado
            </h1>
            <p className="mx-auto max-w-sm text-balance text-muted-foreground text-sm leading-relaxed">
              Selecione um workspace da barra lateral ou crie um novo para
              começar
            </p>
          </div>

          {/* Action */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button className="min-w-[200px] shadow-sm" size="lg">
              <Plus className="size-4" />
              Criar workspace
            </Button>
            <p className="text-muted-foreground text-xs">
              ou escolha um workspace existente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
