import { useQuery } from "@tanstack/react-query";
import { BarChart3, Folder, BookOpen, Code, Briefcase, ArrowUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatsData {
  projects: number;
  blogPosts: number;
  skills: number;
  experience: number;
}

function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  bgColor 
}: {
  title: string;
  value: string;
  change: string;
  changeType: "success" | "warning" | "info";
  icon: React.ElementType;
  bgColor: string;
}) {
  const changeColors = {
    success: "text-emerald-400",
    warning: "text-amber-400", 
    info: "text-blue-400"
  };

  return (
    <Card className="bg-card border border-border" data-testid={`card-${title.toLowerCase().replace(" ", "-")}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(" ", "-")}-value`}>
              {value}
            </p>
            <p className={`text-xs mt-1 ${changeColors[changeType]}`}>
              <ArrowUp className="inline w-3 h-3 mr-1" />
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className="text-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["/api/blog-posts"],
  });

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  const stats: StatsData = {
    projects: Array.isArray(projects) ? projects.length : 0,
    blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
    skills: Array.isArray(skills) ? skills.length : 0,
    experience: 5, // This could be calculated from work experiences
  };

  const publishedPosts = Array.isArray(blogPosts) ? blogPosts.filter(post => post.published)?.length || 0 : 0;
  const draftPosts = Array.isArray(blogPosts) ? blogPosts.length - publishedPosts : 0;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.projects.toString()}
          change="2 this month"
          changeType="success"
          icon={Folder}
          bgColor="bg-blue-500/10 text-blue-400"
        />
        
        <StatsCard
          title="Blog Posts"
          value={stats.blogPosts.toString()}
          change={`${draftPosts} drafts`}
          changeType="warning"
          icon={BookOpen}
          bgColor="bg-blue-400/10 text-blue-400"
        />
        
        <StatsCard
          title="Skills"
          value={stats.skills.toString()}
          change="Technologies"
          changeType="info"
          icon={Code}
          bgColor="bg-emerald-500/10 text-emerald-400"
        />
        
        <StatsCard
          title="Experience"
          value={`${stats.experience}`}
          change="Years"
          changeType="info"
          icon={Briefcase}
          bgColor="bg-amber-500/10 text-amber-400"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-quick-actions-title">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-between p-3 bg-accent hover:bg-accent/80"
                data-testid="button-create-project"
              >
                <div className="flex items-center space-x-3">
                  <Folder className="text-accent-foreground" />
                  <span className="text-accent-foreground font-medium">Create New Project</span>
                </div>
                <ArrowUp className="text-accent-foreground rotate-45" />
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-between p-3 bg-accent hover:bg-accent/80"
                data-testid="button-write-post"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-accent-foreground" />
                  <span className="text-accent-foreground font-medium">Write Blog Post</span>
                </div>
                <ArrowUp className="text-accent-foreground rotate-45" />
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-between p-3 bg-accent hover:bg-accent/80"
                data-testid="button-update-profile"
              >
                <div className="flex items-center space-x-3">
                  <Code className="text-accent-foreground" />
                  <span className="text-accent-foreground font-medium">Update Profile</span>
                </div>
                <ArrowUp className="text-accent-foreground rotate-45" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-recent-activity-title">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {Array.isArray(projects) ? projects.slice(0, 3).map((project, index) => (
                <div key={project.id} className="flex items-start space-x-3" data-testid={`activity-project-${index}`}>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-foreground font-medium">Updated {project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              )) : null}
              
              {Array.isArray(blogPosts) ? blogPosts.slice(0, 2).map((post, index) => (
                <div key={post.id} className="flex items-start space-x-3" data-testid={`activity-blog-${index}`}>
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {post.published ? 'Published' : 'Draft saved for'} {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              )) : null}
              
              {(!Array.isArray(projects) || !projects.length) && (!Array.isArray(blogPosts) || !blogPosts.length) && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
