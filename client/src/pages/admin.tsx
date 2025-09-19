import { useEffect } from "react";
import { useLocation } from "wouter";
import { Route, Switch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/admin/layout";
import { Dashboard } from "@/components/admin/dashboard";
import { Projects } from "@/components/admin/projects";
import { Blog } from "@/components/admin/blog";
import { Profile } from "@/components/admin/profile";
import { About } from "@/components/admin/about";
import { Settings } from "@/components/admin/settings";

export default function Admin() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getPageInfo = (path: string) => {
    switch (path) {
      case "/admin":
        return {
          title: "Dashboard Overview",
          subtitle: "Welcome back! Here's what's happening.",
        };
      case "/admin/projects":
        return {
          title: "Projects Management",
          subtitle: "Manage your portfolio projects",
        };
      case "/admin/blog":
        return {
          title: "Blog Posts",
          subtitle: "Create and manage your blog content",
        };
      case "/admin/profile":
        return {
          title: "User Profile",
          subtitle: "Manage your profile information",
        };
      case "/admin/about":
        return {
          title: "About Page",
          subtitle: "Configure your about page content",
        };
      case "/admin/settings":
        return {
          title: "Settings",
          subtitle: "Configure site settings and preferences",
        };
      default:
        return {
          title: "Admin Panel",
          subtitle: "Manage your portfolio",
        };
    }
  };

  const pageInfo = getPageInfo(location);

  return (
    <AdminLayout
      title={pageInfo.title}
      subtitle={pageInfo.subtitle}
    >
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/projects" component={Projects} />
        <Route path="/admin/blog" component={Blog} />
        <Route path="/admin/profile" component={Profile} />
        <Route path="/admin/about" component={About} />
        <Route path="/admin/settings" component={Settings} />
      </Switch>
    </AdminLayout>
  );
}
