import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { About, InsertAbout, SocialLink, WorkExperience, Education, Skill } from "@shared/schema";

export function About() {
  const { toast } = useToast();

  const { data: about } = useQuery<About>({
    queryKey: ["/api/about"],
  });

  const { data: socialLinks } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
  });

  const { data: workExperiences } = useQuery<WorkExperience[]>({
    queryKey: ["/api/work-experiences"],
  });

  const { data: education } = useQuery<Education[]>({
    queryKey: ["/api/education"],
  });

  const [aboutData, setAboutData] = useState<InsertAbout>({
    firstName: "",
    lastName: "",
    role: "",
    avatar: "",
    location: "",
    languages: "",
    title: "",
    description: "",
    tableOfContentDisplay: true,
    tableOfContentSubItems: false,
    avatarDisplay: true,
    calendarDisplay: false,
    calendarLink: "",
    introDisplay: true,
    introTitle: "",
    introDescription: "",
    workDisplay: true,
    workTitle: "",
    studiesDisplay: true,
    studiesTitle: "",
    technicalDisplay: true,
    technicalTitle: "",
  });

  // Update form data when about loads
  useState(() => {
    if (about) {
      setAboutData(about);
    }
  });

  const createAboutMutation = useMutation({
    mutationFn: (data: InsertAbout) => apiRequest("POST", "/api/about", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({
        title: "Success",
        description: "About page created successfully",
      });
    },
  });

  const updateAboutMutation = useMutation({
    mutationFn: (data: InsertAbout) => apiRequest("PUT", `/api/about/${about?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({
        title: "Success",
        description: "About page updated successfully",
      });
    },
  });

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aboutData.firstName || !aboutData.lastName || !aboutData.role || !aboutData.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (about) {
      updateAboutMutation.mutate(aboutData);
    } else {
      createAboutMutation.mutate(aboutData);
    }
  };

  const isPending = createAboutMutation.isPending || updateAboutMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground" data-testid="text-about-title">
          About Page Management
        </h3>
        <p className="text-sm text-muted-foreground">Configure your about page content and sections</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="work">Work Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={aboutData.firstName}
                      onChange={(e) => setAboutData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      data-testid="input-about-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={aboutData.lastName}
                      onChange={(e) => setAboutData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      data-testid="input-about-last-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={aboutData.title}
                      onChange={(e) => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      data-testid="input-about-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={aboutData.role}
                      onChange={(e) => setAboutData(prev => ({ ...prev, role: e.target.value }))}
                      required
                      data-testid="input-about-role"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={aboutData.location}
                      onChange={(e) => setAboutData(prev => ({ ...prev, location: e.target.value }))}
                      required
                      data-testid="input-about-location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Avatar URL *</Label>
                    <Input
                      id="avatar"
                      type="url"
                      value={aboutData.avatar}
                      onChange={(e) => setAboutData(prev => ({ ...prev, avatar: e.target.value }))}
                      required
                      data-testid="input-about-avatar"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={aboutData.description}
                    onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                    data-testid="textarea-about-description"
                  />
                </div>

                <div>
                  <Label htmlFor="introTitle">Introduction Title *</Label>
                  <Input
                    id="introTitle"
                    value={aboutData.introTitle}
                    onChange={(e) => setAboutData(prev => ({ ...prev, introTitle: e.target.value }))}
                    required
                    data-testid="input-intro-title"
                  />
                </div>

                <div>
                  <Label htmlFor="introDescription">Introduction Content *</Label>
                  <Textarea
                    id="introDescription"
                    value={aboutData.introDescription}
                    onChange={(e) => setAboutData(prev => ({ ...prev, introDescription: e.target.value }))}
                    rows={6}
                    required
                    data-testid="textarea-intro-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="workTitle">Work Section Title *</Label>
                    <Input
                      id="workTitle"
                      value={aboutData.workTitle}
                      onChange={(e) => setAboutData(prev => ({ ...prev, workTitle: e.target.value }))}
                      required
                      data-testid="input-work-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studiesTitle">Education Section Title *</Label>
                    <Input
                      id="studiesTitle"
                      value={aboutData.studiesTitle}
                      onChange={(e) => setAboutData(prev => ({ ...prev, studiesTitle: e.target.value }))}
                      required
                      data-testid="input-studies-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="technicalTitle">Skills Section Title *</Label>
                    <Input
                      id="technicalTitle"
                      value={aboutData.technicalTitle}
                      onChange={(e) => setAboutData(prev => ({ ...prev, technicalTitle: e.target.value }))}
                      required
                      data-testid="input-technical-title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="avatarDisplay"
                      checked={aboutData.avatarDisplay || false}
                      onCheckedChange={(checked) => setAboutData(prev => ({ ...prev, avatarDisplay: checked }))}
                      data-testid="switch-avatar-display"
                    />
                    <Label htmlFor="avatarDisplay">Show Avatar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="calendarDisplay"
                      checked={aboutData.calendarDisplay || false}
                      onCheckedChange={(checked) => setAboutData(prev => ({ ...prev, calendarDisplay: checked }))}
                      data-testid="switch-calendar-display"
                    />
                    <Label htmlFor="calendarDisplay">Show Calendar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="introDisplay"
                      checked={aboutData.introDisplay || false}
                      onCheckedChange={(checked) => setAboutData(prev => ({ ...prev, introDisplay: checked }))}
                      data-testid="switch-intro-display"
                    />
                    <Label htmlFor="introDisplay">Show Introduction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="workDisplay"
                      checked={aboutData.workDisplay || false}
                      onCheckedChange={(checked) => setAboutData(prev => ({ ...prev, workDisplay: checked }))}
                      data-testid="switch-work-display"
                    />
                    <Label htmlFor="workDisplay">Show Work</Label>
                  </div>
                </div>

                {aboutData.calendarDisplay && (
                  <div>
                    <Label htmlFor="calendarLink">Calendar Link</Label>
                    <Input
                      id="calendarLink"
                      type="url"
                      value={aboutData.calendarLink || ""}
                      onChange={(e) => setAboutData(prev => ({ ...prev, calendarLink: e.target.value }))}
                      placeholder="https://calendly.com/username"
                      data-testid="input-calendar-link"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending} data-testid="button-save-about">
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="mt-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-foreground">Work Experience</h4>
                <Button data-testid="button-add-work-experience">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {workExperiences?.map((experience) => (
                  <div key={experience.id} className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{experience.role}</h5>
                        <p className="text-sm text-muted-foreground">{experience.company} • {experience.timeframe}</p>
                        {experience.achievements && (
                          <p className="text-sm text-foreground mt-2">{experience.achievements}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!workExperiences || workExperiences.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No work experiences added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-foreground">Education</h4>
                <Button data-testid="button-add-education">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {education?.map((item) => (
                  <div key={item.id} className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{item.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!education || education.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No education entries added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-foreground">Social Links</h4>
                <Button data-testid="button-add-social-link">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
              <div className="space-y-4">
                {socialLinks?.map((link) => (
                  <div key={link.id} className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">{link.icon}</div>
                        <div>
                          <h5 className="font-medium text-foreground">{link.name}</h5>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!socialLinks || socialLinks.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">No social links added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
