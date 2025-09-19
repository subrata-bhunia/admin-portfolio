import { useState } from "react";
import { Sidebar } from "./sidebar";
import { ChevronLeft, ChevronRight, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onAddNew?: () => void;
}

export function AdminLayout({ children, title, subtitle, onAddNew }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
              data-testid="button-toggle-sidebar"
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" data-testid="button-notifications">
              <Bell className="w-4 h-4" />
            </Button>
            {onAddNew && (
              <Button onClick={onAddNew} size="sm" data-testid="button-add-new">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
