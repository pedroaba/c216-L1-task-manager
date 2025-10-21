import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeButtonProps = {
  theme: "light" | "dark" | "system";
};

export function ThemeButton({ theme }: ThemeButtonProps) {
  const { setTheme, theme: currentTheme } = useTheme();

  return (
    <button
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-4 opacity-60 transition-all duration-200 hover:border-primary hover:bg-accent/50 hover:opacity-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        currentTheme === theme && "border-blue-900 dark:border-blue-500"
      )}
      onClick={() => setTheme(theme)}
      type="button"
    >
      <div
        className={cn(
          "relative size-12 overflow-hidden rounded-lg border bg-white shadow-sm",
          theme === "light" && "bg-white",
          theme === "dark" && "bg-slate-800",
          theme === "system" && "bg-slate-200",
          currentTheme === theme &&
            "border-2 border-blue-900 dark:border-blue-500"
        )}
      >
        {theme === "light" && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
        )}
        {theme === "dark" && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        {theme === "system" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-200 to-slate-900" />
        )}
        <div className="absolute right-1 bottom-1 size-2 rounded-full bg-yellow-400" />
      </div>
      <span
        className={cn(
          "font-medium text-foreground text-sm capitalize group-hover:text-primary",
          currentTheme === theme && "text-blue-900 dark:text-blue-500"
        )}
      >
        {theme}
      </span>
    </button>
  );
}
