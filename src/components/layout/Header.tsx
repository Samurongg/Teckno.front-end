import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { GlobalOrderSearch } from "./GlobalOrderSearch";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { getSession, signOut } from "@/lib/auth";

interface HeaderProps {
  title: string;
  subtitle?: string | undefined;
  showSearch?: boolean;
}

export function Header({ title, subtitle, showSearch = true }: HeaderProps) {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggleTheme() {
    const light = !isLight;
    document.documentElement.classList.toggle("light", light);
    document.documentElement.classList.toggle("dark", !light);
    setIsLight(light);
    try {
      localStorage.setItem("tecnomarket-theme", light ? "light" : "dark");
    } catch {
      // El cambio visual sigue funcionando si el almacenamiento no está disponible.
    }
  }

  const user = getSession();
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleSignOut() {
    signOut();
    window.location.assign("/login");
  }

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
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>

      {showSearch ? <GlobalOrderSearch /> : null}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
        title={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      >
        {isLight ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        <span className="sr-only">Notificaciones</span>
      </Button>

      <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-xs font-medium">{user?.name}</p>
          <p className="text-[10px] text-muted-foreground">{user?.role}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Cerrar sesión">
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
