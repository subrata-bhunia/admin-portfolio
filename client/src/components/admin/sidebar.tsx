import { Crown, BarChart3, Folder, BookOpen, User, Info, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Projects", href: "/admin/projects", icon: Folder },
  { name: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  { name: "User Profile", href: "/admin/profile", icon: User },
  { name: "About Page", href: "/admin/about", icon: Info },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Crown className="text-primary-foreground text-sm" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="text-app-title">
                Portfolio Admin
              </h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <User className="text-accent-foreground text-sm" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate" data-testid="text-username">
                  {user?.name || user?.email || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                <LogOut className="text-sm" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
