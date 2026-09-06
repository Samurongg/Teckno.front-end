import { FormEvent, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — TecnoMarket Analytics" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("analyst@tecnomarket.pe");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getSession()) window.location.replace("/dashboard");
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signIn(email, password)) {
      setError("El correo o la contraseña no son correctos.");
      return;
    }
    window.location.assign("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <BarChart3 className="size-6" /> TecnoMarket Analytics
        </div>
        <div className="max-w-md">
          <p className="text-4xl font-semibold tracking-tight">
            Decisiones logísticas basadas en datos.
          </p>
          <p className="mt-4 text-sm text-primary-foreground/75">
            Analiza pedidos históricos y estima el riesgo de retraso con el modelo de Machine
            Learning.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/65">
          Acceso exclusivo para el equipo autorizado.
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div>
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa para acceder al panel de analítica.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" type="submit">
            <LockKeyhole className="size-4" /> Iniciar sesión
          </Button>

          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Demo: <strong>analyst@tecnomarket.pe</strong> · contraseña: <strong>teckno2026</strong>
          </p>
        </form>
      </section>
    </main>
  );
}
