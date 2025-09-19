import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertBlogPostSchema,
  insertUserInfoSchema,
  insertSettingsSchema,
  insertAboutSchema,
  insertSocialLinkSchema,
  insertWorkExperienceSchema,
  insertEducationSchema,
  insertSkillSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Blog Posts routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const blogPost = await storage.getBlogPost(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      res.status(201).json(blogPost);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const blogPost = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(blogPost);
    } catch (error) {
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // User Info routes
  app.get("/api/user-info", async (req, res) => {
    try {
      const userInfo = await storage.getUserInfo();
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user info" });
    }
  });

  app.post("/api/user-info", async (req, res) => {
    try {
      const validatedData = insertUserInfoSchema.parse(req.body);
      const userInfo = await storage.createUserInfo(validatedData);
      res.status(201).json(userInfo);
    } catch (error) {
      res.status(400).json({ message: "Invalid user info data" });
    }
  });

  app.put("/api/user-info/:id", async (req, res) => {
    try {
      const validatedData = insertUserInfoSchema.partial().parse(req.body);
      const userInfo = await storage.updateUserInfo(req.params.id, validatedData);
      res.json(userInfo);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user info" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.createSettings(validatedData);
      res.status(201).json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  app.put("/api/settings/:id", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(req.params.id, validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Failed to update settings" });
    }
  });

  // About routes
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAbout();
      res.json(about);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch about" });
    }
  });

  app.post("/api/about", async (req, res) => {
    try {
      const validatedData = insertAboutSchema.parse(req.body);
      const about = await storage.createAbout(validatedData);
      res.status(201).json(about);
    } catch (error) {
      res.status(400).json({ message: "Invalid about data" });
    }
  });

  app.put("/api/about/:id", async (req, res) => {
    try {
      const validatedData = insertAboutSchema.partial().parse(req.body);
      const about = await storage.updateAbout(req.params.id, validatedData);
      res.json(about);
    } catch (error) {
      res.status(400).json({ message: "Failed to update about" });
    }
  });

  // Social Links routes
  app.get("/api/social-links", async (req, res) => {
    try {
      const socialLinks = await storage.getSocialLinks();
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  app.post("/api/social-links", async (req, res) => {
    try {
      const validatedData = insertSocialLinkSchema.parse(req.body);
      const socialLink = await storage.createSocialLink(validatedData);
      res.status(201).json(socialLink);
    } catch (error) {
      res.status(400).json({ message: "Invalid social link data" });
    }
  });

  app.put("/api/social-links/:id", async (req, res) => {
    try {
      const validatedData = insertSocialLinkSchema.partial().parse(req.body);
      const socialLink = await storage.updateSocialLink(req.params.id, validatedData);
      res.json(socialLink);
    } catch (error) {
      res.status(400).json({ message: "Failed to update social link" });
    }
  });

  app.delete("/api/social-links/:id", async (req, res) => {
    try {
      await storage.deleteSocialLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social link" });
    }
  });

  // Work Experiences routes
  app.get("/api/work-experiences", async (req, res) => {
    try {
      const workExperiences = await storage.getWorkExperiences();
      res.json(workExperiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch work experiences" });
    }
  });

  app.post("/api/work-experiences", async (req, res) => {
    try {
      const validatedData = insertWorkExperienceSchema.parse(req.body);
      const workExperience = await storage.createWorkExperience(validatedData);
      res.status(201).json(workExperience);
    } catch (error) {
      res.status(400).json({ message: "Invalid work experience data" });
    }
  });

  app.put("/api/work-experiences/:id", async (req, res) => {
    try {
      const validatedData = insertWorkExperienceSchema.partial().parse(req.body);
      const workExperience = await storage.updateWorkExperience(req.params.id, validatedData);
      res.json(workExperience);
    } catch (error) {
      res.status(400).json({ message: "Failed to update work experience" });
    }
  });

  app.delete("/api/work-experiences/:id", async (req, res) => {
    try {
      await storage.deleteWorkExperience(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete work experience" });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(validatedData);
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.put("/api/education/:id", async (req, res) => {
    try {
      const validatedData = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(req.params.id, validatedData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Failed to update education" });
    }
  });

  app.delete("/api/education/:id", async (req, res) => {
    try {
      await storage.deleteEducation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(req.params.id, validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
