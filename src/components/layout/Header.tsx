import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Header({ title, subtitle, showSearch = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Abrir navegación</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {showSearch ? (
        <div className="relative hidden md:block md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar pedido, región…" className="pl-9" />
        </div>
      ) : null}

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        <span className="sr-only">Notificaciones</span>
      </Button>

      <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          AC
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-xs font-medium">A. Caycho</p>
          <p className="text-[10px] text-muted-foreground">Data Analyst</p>
        </div>
      </div>
    </header>
  );
}
