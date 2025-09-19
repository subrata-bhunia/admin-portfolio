import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Edit, Eye, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { ProjectModal } from "./modals/project-modal";
import type { Project } from "@shared/schema";

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const categories = Array.from(new Set(projects?.map(p => p.category) || []));

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="h-32 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-projects-title">
            Projects Management
          </h3>
          <p className="text-sm text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-project">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-projects"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-auto" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-auto" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-card border border-border">
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first project"}
            </p>
            <Button onClick={handleAddNew} data-testid="button-create-first-project">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-card border border-border hover:border-accent transition-colors" data-testid={`card-project-${project.id}`}>
              <CardContent className="p-0">
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    data-testid={`img-project-${project.id}`}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-500/10 text-blue-400"
                      data-testid={`badge-category-${project.id}`}
                    >
                      {project.category}
                    </Badge>
                    <Badge 
                      variant={project.status === "published" ? "default" : "secondary"}
                      className={project.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}
                      data-testid={`badge-status-${project.id}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2" data-testid={`text-project-title-${project.id}`}>
                    {project.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`text-project-description-${project.id}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies?.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span data-testid={`text-project-updated-${project.id}`}>
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'No date'}
                    </span>
                    {project.featured && (
                      <Badge variant="outline" className="text-xs">Featured</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(project)}
                      data-testid={`button-edit-${project.id}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {project.liveUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => project.liveUrl && window.open(project.liveUrl, '_blank')}
                        data-testid={`button-view-live-${project.id}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${project.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
