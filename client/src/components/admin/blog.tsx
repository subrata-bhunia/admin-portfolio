import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Eye, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { BlogModal } from "./modals/blog-modal";
import type { BlogPost } from "@shared/schema";

export function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/blog-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && post.published) ||
                         (statusFilter === "draft" && !post.published);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deletePostMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingPost(null);
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
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted"></div>
                <div className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
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
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-blog-title">
            Blog Posts
          </h3>
          <p className="text-sm text-muted-foreground">Create and manage your blog content</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-blog-post">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-blog-posts"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-auto" data-testid="select-blog-status-filter">
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

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="bg-card border border-border">
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first blog post"}
            </p>
            <Button onClick={handleAddNew} data-testid="button-create-first-blog-post">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-card border border-border hover:border-accent transition-colors overflow-hidden" data-testid={`card-blog-post-${post.id}`}>
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-blog-post-${post.id}`}
                />
              )}
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-500/10 text-blue-400"
                    data-testid={`badge-blog-category-${post.id}`}
                  >
                    {post.category || "General"}
                  </Badge>
                  <Badge 
                    variant={post.published ? "default" : "secondary"}
                    className={post.published ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}
                    data-testid={`badge-blog-status-${post.id}`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <h4 className="font-semibold text-foreground mb-2" data-testid={`text-blog-title-${post.id}`}>
                  {post.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`text-blog-excerpt-${post.id}`}>
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span data-testid={`text-blog-author-${post.id}`}>{post.author}</span>
                  <span data-testid={`text-blog-date-${post.id}`}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 
                     post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'No date'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(post)}
                    data-testid={`button-edit-blog-${post.id}`}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-view-blog-${post.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-blog-${post.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <BlogModal
          post={editingPost}
          onClose={() => {
            setShowModal(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}
