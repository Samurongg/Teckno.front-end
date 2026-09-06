import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getSession } from "@/lib/auth";

interface AppLayoutProps {
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}

export function AppLayout({ title, subtitle, children }: AppLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      window.location.replace("/login");
      return;
    }
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
