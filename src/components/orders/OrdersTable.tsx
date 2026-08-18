import { useMemo, useState } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import type { Order } from "@/types";
import { REGIONS, SHIPPING_TYPES } from "@/lib/mock-data";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import { EmptyState } from "@/components/common/States";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = keyof Pick<
  Order,
  "date" | "distanceKm" | "prepTimeH" | "items" | "weightKg" | "riskScore"
>;

const ALL = "all";
const PAGE_SIZE = 10;

export function OrdersTable({
  orders,
  onSelect,
}: {
  orders: Order[];
  onSelect: (order: Order) => void;
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>(ALL);
  const [shipping, setShipping] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = orders.filter((o) => {
      if (q && !`${o.id} ${o.region} ${o.shippingType}`.toLowerCase().includes(q))
        return false;
      if (region !== ALL && o.region !== region) return false;
      if (shipping !== ALL && o.shippingType !== shipping) return false;
      if (status !== ALL && o.status !== status) return false;
      if (from && o.date < from) return false;
      if (to && o.date > to) return false;
      return true;
    });
    return rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      return (av < bv ? -1 : 1) * (sortAsc ? 1 : -1);
    });
  }, [orders, query, region, shipping, status, from, to, sortKey, sortAsc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const sort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const reset = () => {
    setQuery("");
    setRegion(ALL);
    setShipping(ALL);
    setStatus(ALL);
    setFrom("");
    setTo("");
    setPage(1);
  };

  const SortHead = ({ label, k }: { label: string; k: SortKey }) => (
    <TableHead>
      <button
        onClick={() => sort(k)}
        className="inline-flex items-center gap-1 text-xs font-medium hover:text-foreground"
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );

  return (
    <div className="panel">
      {/* FilterBar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por ID, región o envío"
            className="pl-9"
          />
        </div>
        <Select
          value={region}
          onValueChange={(v) => {
            setRegion(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las regiones</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={shipping}
          onValueChange={(v) => {
            setShipping(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo de envío" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los envíos</SelectItem>
            {SHIPPING_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todo estado</SelectItem>
            <SelectItem value="A tiempo">A tiempo</SelectItem>
            <SelectItem value="Tardía">Tardía</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-[150px]"
          aria-label="Desde"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-[150px]"
          aria-label="Hasta"
        />
        <Button variant="ghost" size="sm" onClick={reset}>
          <X className="size-4" /> Limpiar
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">ID</TableHead>
                <SortHead label="Fecha" k="date" />
                <TableHead className="text-xs">Región</TableHead>
                <TableHead className="text-xs">Envío</TableHead>
                <SortHead label="Distancia" k="distanceKm" />
                <SortHead label="Preparación" k="prepTimeH" />
                <SortHead label="Ítems" k="items" />
                <SortHead label="Peso" k="weightKg" />
                <TableHead className="text-xs">Estado</TableHead>
                <SortHead label="Riesgo" k="riskScore" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow
                  key={o.id}
                  onClick={() => onSelect(o)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="text-xs">{o.date}</TableCell>
                  <TableCell className="text-xs">{o.region}</TableCell>
                  <TableCell className="text-xs">{o.shippingType}</TableCell>
                  <TableCell className="text-xs">{o.distanceKm} km</TableCell>
                  <TableCell className="text-xs">{o.prepTimeH} h</TableCell>
                  <TableCell className="text-xs">{o.items}</TableCell>
                  <TableCell className="text-xs">{o.weightKg} kg</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={o.risk} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs text-muted-foreground">
        <span>
          {filtered.length} pedidos · página {current} de {pages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
