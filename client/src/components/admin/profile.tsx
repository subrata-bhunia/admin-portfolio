import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Camera, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { UserInfo, InsertUserInfo } from "@shared/schema";

export function Profile() {
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState("");

  const { data: userInfo, isLoading } = useQuery<UserInfo>({
    queryKey: ["/api/user-info"],
  });

  const [formData, setFormData] = useState<InsertUserInfo>({
    firstName: "",
    lastName: "",
    title: "",
    role: "",
    bio: "",
    avatar: "",
    location: "",
    timezone: "",
    email: "",
    phone: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    languages: [],
    socialLinks: "",
    skills: [],
    resume: "",
  });

  // Update form data when user info loads
  useState(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        title: userInfo.title || "",
        role: userInfo.role || "",
        bio: userInfo.bio || "",
        avatar: userInfo.avatar || "",
        location: userInfo.location || "",
        timezone: userInfo.timezone || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        website: userInfo.website || "",
        github: userInfo.github || "",
        linkedin: userInfo.linkedin || "",
        twitter: userInfo.twitter || "",
        languages: userInfo.languages || [],
        socialLinks: userInfo.socialLinks || "",
        skills: userInfo.skills || [],
        resume: userInfo.resume || "",
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertUserInfo) => apiRequest("POST", "/api/user-info", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-info"] });
      toast({
        title: "Success",
        description: "Profile created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertUserInfo) => apiRequest("PUT", `/api/user-info/${userInfo?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-info"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.title || !formData.role || !formData.timezone || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userInfo) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && formData.skills && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate-pulse bg-card border border-border rounded-lg p-6">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded mb-4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
          <div className="lg:col-span-2 animate-pulse bg-card border border-border rounded-lg p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground" data-testid="text-profile-title">
          User Profile
        </h3>
        <p className="text-sm text-muted-foreground">Manage your profile information and skills</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Profile avatar" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                      data-testid="img-profile-avatar"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-foreground mb-1" data-testid="text-profile-name">
                  {formData.firstName} {formData.lastName}
                </h4>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-profile-title-role">
                  {formData.title}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    type="url"
                    value={formData.avatar || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    data-testid="input-avatar-url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Personal Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      data-testid="input-professional-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Current Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      required
                      data-testid="input-current-role"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      data-testid="textarea-bio"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        data-testid="input-location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Input
                        id="timezone"
                        value={formData.timezone}
                        onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                        placeholder="e.g., UTC-8, EST"
                        required
                        data-testid="input-timezone"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        data-testid="input-website"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        type="url"
                        value={formData.github || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                        placeholder="https://github.com/username"
                        data-testid="input-github"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={formData.linkedin || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                        data-testid="input-linkedin"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Manager */}
          <div className="lg:col-span-3">
            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Skills & Technologies</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add skill"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      data-testid="input-add-skill"
                    />
                    <Button type="button" variant="outline" onClick={addSkill} data-testid="button-add-skill">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.skills || []).map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill)}
                          className="h-auto p-0 w-4 h-4 ml-2 hover:text-destructive"
                          data-testid={`button-remove-skill-${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} data-testid="button-save-profile">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
