import { useState, type FormEvent } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GlobalOrderSearch() {
  const location = useRouterState({ select: (state) => state.location });
  const query = new URLSearchParams(location.searchStr).get("q") ?? "";
  return <SearchForm key={`${location.pathname}:${query}`} initialQuery={query} />;
}

function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ to: "/orders", search: query.trim() ? { q: query.trim() } : {} });
  }

  return (
    <form
      role="search"
      aria-label="Buscar pedidos en la plataforma"
      onSubmit={submit}
      className="order-last flex w-full items-center gap-1 md:order-none md:w-72"
    >
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar código o departamento…"
        aria-label="Código de pedido o departamento"
        title="Escribe un código o departamento y pulsa Enter para buscar en Pedidos"
        className="min-w-0"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Buscar en Pedidos"
        title="Buscar en Pedidos"
      >
        <Search className="size-4" />
      </Button>
    </form>
  );
}
