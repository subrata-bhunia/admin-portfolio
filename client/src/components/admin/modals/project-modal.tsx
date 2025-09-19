import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const isEdit = !!project;
  const { toast } = useToast();

  const [formData, setFormData] = useState<InsertProject>({
    title: project?.title || "",
    description: project?.description || "",
    longDescription: project?.longDescription || "",
    image: project?.image || "",
    technologies: project?.technologies || [],
    githubUrl: project?.githubUrl || "",
    liveUrl: project?.liveUrl || "",
    category: project?.category || "",
    status: project?.status || "draft",
    featured: project?.featured || false,
    order: project?.order || 0,
    year: project?.year || new Date().getFullYear(),
  });

  const [techInput, setTechInput] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("POST", "/api/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertProject) => apiRequest("PUT", `/api/projects/${project?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project", 
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-project">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-modal-title">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-modal">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                data-testid="input-project-title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Web Development"
                required
                data-testid="input-project-category"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
              data-testid="textarea-project-description"
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              rows={5}
              data-testid="textarea-project-long-description"
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              data-testid="input-project-image"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                data-testid="input-project-github"
              />
            </div>
            <div>
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={formData.liveUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://example.com"
                data-testid="input-project-live"
              />
            </div>
          </div>

          <div>
            <Label>Technologies</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                data-testid="input-add-technology"
              />
              <Button type="button" variant="outline" onClick={addTechnology} data-testid="button-add-technology">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <div key={tech} className="flex items-center space-x-1 bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                  <span>{tech}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTechnology(tech)}
                    className="h-auto p-0 w-4 h-4"
                    data-testid={`button-remove-tech-${tech}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || "draft"} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger data-testid="select-project-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                data-testid="input-project-year"
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                data-testid="input-project-order"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              data-testid="switch-project-featured"
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} data-testid="button-save-project">
              {isPending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
