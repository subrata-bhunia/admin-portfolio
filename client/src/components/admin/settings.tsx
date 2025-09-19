import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Save, Palette, Mail, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Settings, InsertSettings } from "@shared/schema";

export function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState<InsertSettings>({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    newsletter: "",
    contactForm: "",
    theme: "",
  });

  const [contactFormEnabled, setContactFormEnabled] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [autoReplyMessage, setAutoReplyMessage] = useState("");
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [newsletterDescription, setNewsletterDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [colorTheme, setColorTheme] = useState("dark");

  // Update form data when settings loads
  useState(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        siteUrl: settings.siteUrl || "",
        newsletter: settings.newsletter || "",
        contactForm: settings.contactForm || "",
        theme: settings.theme || "",
      });

      // Parse JSON fields
      if (settings.contactForm) {
        try {
          const contactData = JSON.parse(settings.contactForm);
          setContactFormEnabled(contactData.enabled || false);
          setNotificationEmail(contactData.notificationEmail || "");
          setAutoReplyMessage(contactData.autoReplyMessage || "");
        } catch (e) {
          console.error("Failed to parse contact form settings");
        }
      }

      if (settings.newsletter) {
        try {
          const newsletterData = JSON.parse(settings.newsletter);
          setNewsletterEnabled(newsletterData.enabled || false);
          setNewsletterTitle(newsletterData.title || "");
          setNewsletterDescription(newsletterData.description || "");
        } catch (e) {
          console.error("Failed to parse newsletter settings");
        }
      }

      if (settings.theme) {
        try {
          const themeData = JSON.parse(settings.theme);
          setPrimaryColor(themeData.primaryColor || "#3b82f6");
          setFontFamily(themeData.fontFamily || "Inter");
          setColorTheme(themeData.colorTheme || "dark");
        } catch (e) {
          console.error("Failed to parse theme settings");
        }
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertSettings) => apiRequest("POST", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create settings",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertSettings) => apiRequest("PUT", `/api/settings/${settings?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSiteSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.siteDescription || !formData.siteUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const dataToSave = {
      ...formData,
      contactForm: JSON.stringify({
        enabled: contactFormEnabled,
        notificationEmail,
        autoReplyMessage,
      }),
      newsletter: JSON.stringify({
        enabled: newsletterEnabled,
        title: newsletterTitle,
        description: newsletterDescription,
      }),
      theme: JSON.stringify({
        primaryColor,
        fontFamily,
        colorTheme,
      }),
    };

    if (settings) {
      updateMutation.mutate(dataToSave);
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-card border border-border rounded-lg p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground" data-testid="text-settings-title">
          Settings
        </h3>
        <p className="text-sm text-muted-foreground">Configure your site settings and preferences</p>
      </div>

      <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Settings */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Site Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name *</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                  required
                  data-testid="input-site-name"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description *</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                  required
                  data-testid="textarea-site-description"
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">Site URL *</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={formData.siteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                  required
                  data-testid="input-site-url"
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Theme Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="colorTheme">Color Theme</Label>
                <Select value={colorTheme} onValueChange={setColorTheme}>
                  <SelectTrigger data-testid="select-color-theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Theme</SelectItem>
                    <SelectItem value="light">Light Theme</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded border border-border bg-background"
                    data-testid="input-primary-color"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                    data-testid="input-primary-color-text"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger data-testid="select-font-family">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Settings */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Form</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="contactFormEnabled"
                  checked={contactFormEnabled}
                  onCheckedChange={setContactFormEnabled}
                  data-testid="switch-contact-form-enabled"
                />
                <Label htmlFor="contactFormEnabled">Enable contact form</Label>
              </div>
              <div>
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  data-testid="input-notification-email"
                />
              </div>
              <div>
                <Label htmlFor="autoReplyMessage">Auto Reply Message</Label>
                <Textarea
                  id="autoReplyMessage"
                  value={autoReplyMessage}
                  onChange={(e) => setAutoReplyMessage(e.target.value)}
                  rows={3}
                  data-testid="textarea-auto-reply"
                />
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Settings */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5" />
                <span>Newsletter</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="newsletterEnabled"
                  checked={newsletterEnabled}
                  onCheckedChange={setNewsletterEnabled}
                  data-testid="switch-newsletter-enabled"
                />
                <Label htmlFor="newsletterEnabled">Enable newsletter signup</Label>
              </div>
              <div>
                <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                <Input
                  id="newsletterTitle"
                  value={newsletterTitle}
                  onChange={(e) => setNewsletterTitle(e.target.value)}
                  data-testid="input-newsletter-title"
                />
              </div>
              <div>
                <Label htmlFor="newsletterDescription">Signup Description</Label>
                <Textarea
                  id="newsletterDescription"
                  value={newsletterDescription}
                  onChange={(e) => setNewsletterDescription(e.target.value)}
                  rows={2}
                  data-testid="textarea-newsletter-description"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} data-testid="button-save-settings">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
