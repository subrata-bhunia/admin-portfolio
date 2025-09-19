import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export function BlogModal({ post, onClose }: BlogModalProps) {
  const isEdit = !!post;
  const { toast } = useToast();

  const [formData, setFormData] = useState<InsertBlogPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    author: post?.author || "",
    publishedAt: post?.publishedAt || null,
    featured: post?.featured || false,
    tags: post?.tags || [],
    category: post?.category || "",
    image: post?.image || "",
    published: post?.published || false,
  });

  const [tagInput, setTagInput] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: InsertBlogPost) => apiRequest("POST", "/api/blog-posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertBlogPost) => apiRequest("PUT", `/api/blog-posts/${post?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.author) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Auto-generate slug if not provided
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const dataToSubmit = {
      ...formData,
      slug,
      publishedAt: formData.published && !formData.publishedAt ? new Date() : formData.publishedAt,
    };

    if (isEdit) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && formData.tags && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-blog-post">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-modal-title">
            {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
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
                data-testid="input-blog-title"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated-from-title"
                data-testid="input-blog-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                required
                data-testid="input-blog-author"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Technology, Design"
                data-testid="input-blog-category"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Featured Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              data-testid="input-blog-image"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              placeholder="Short description of the blog post"
              data-testid="textarea-blog-excerpt"
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              required
              placeholder="Write your blog post content here..."
              data-testid="textarea-blog-content"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                data-testid="input-add-tag"
              />
              <Button type="button" variant="outline" onClick={addTag} data-testid="button-add-tag">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <div key={tag} className="flex items-center space-x-1 bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
                  <span>{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-auto p-0 w-4 h-4"
                    data-testid={`button-remove-tag-${tag}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                data-testid="switch-blog-published"
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                data-testid="switch-blog-featured"
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} data-testid="button-save-blog-post">
              {isPending ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
