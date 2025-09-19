import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type BlogPost,
  type InsertBlogPost,
  type UserInfo,
  type InsertUserInfo,
  type Settings,
  type InsertSettings,
  type About,
  type InsertAbout,
  type SocialLink,
  type InsertSocialLink,
  type WorkExperience,
  type InsertWorkExperience,
  type Education,
  type InsertEducation,
  type Skill,
  type InsertSkill
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;

  // User Info
  getUserInfo(): Promise<UserInfo | undefined>;
  createUserInfo(userInfo: InsertUserInfo): Promise<UserInfo>;
  updateUserInfo(id: string, userInfo: Partial<InsertUserInfo>): Promise<UserInfo>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(id: string, settings: Partial<InsertSettings>): Promise<Settings>;

  // About
  getAbout(): Promise<About | undefined>;
  createAbout(about: InsertAbout): Promise<About>;
  updateAbout(id: string, about: Partial<InsertAbout>): Promise<About>;

  // Social Links
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(socialLink: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: string, socialLink: Partial<InsertSocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<void>;

  // Work Experiences
  getWorkExperiences(): Promise<WorkExperience[]>;
  createWorkExperience(workExperience: InsertWorkExperience): Promise<WorkExperience>;
  updateWorkExperience(id: string, workExperience: Partial<InsertWorkExperience>): Promise<WorkExperience>;
  deleteWorkExperience(id: string): Promise<void>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: string, education: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: string): Promise<void>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private blogPosts: Map<string, BlogPost>;
  private userInfo: UserInfo | undefined;
  private settings: Settings | undefined;
  private about: About | undefined;
  private socialLinks: Map<string, SocialLink>;
  private workExperiences: Map<string, WorkExperience>;
  private educationItems: Map<string, Education>;
  private skills: Map<string, Skill>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.blogPosts = new Map();
    this.socialLinks = new Map();
    this.workExperiences = new Map();
    this.educationItems = new Map();
    this.skills = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => (b.order || 0) - (a.order || 0));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: now,
      order: insertProject.order ?? null,
      year: insertProject.year ?? null,
      status: insertProject.status ?? null,
      featured: insertProject.featured ?? null,
      longDescription: insertProject.longDescription ?? null,
      githubUrl: insertProject.githubUrl ?? null,
      liveUrl: insertProject.liveUrl ?? null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject: Project = { 
      ...project, 
      ...updates, 
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt || b.updatedAt || 0).getTime() - new Date(a.publishedAt || a.updatedAt || 0).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = { 
      ...insertBlogPost, 
      id,
      updatedAt: now,
      excerpt: insertBlogPost.excerpt ?? null,
      category: insertBlogPost.category ?? null,
      image: insertBlogPost.image ?? null,
      published: insertBlogPost.published ?? null,
      featured: insertBlogPost.featured ?? null,
      tags: insertBlogPost.tags ?? null,
      publishedAt: insertBlogPost.publishedAt ?? null
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const blogPost = this.blogPosts.get(id);
    if (!blogPost) throw new Error("Blog post not found");
    
    const updatedBlogPost: BlogPost = { 
      ...blogPost, 
      ...updates, 
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    this.blogPosts.delete(id);
  }

  // User Info
  async getUserInfo(): Promise<UserInfo | undefined> {
    return this.userInfo;
  }

  async createUserInfo(insertUserInfo: InsertUserInfo): Promise<UserInfo> {
    const id = randomUUID();
    const now = new Date();
    this.userInfo = { 
      ...insertUserInfo, 
      id,
      createdAt: now,
      updatedAt: now,
      bio: insertUserInfo.bio ?? null,
      avatar: insertUserInfo.avatar ?? null,
      location: insertUserInfo.location ?? null,
      phone: insertUserInfo.phone ?? null,
      website: insertUserInfo.website ?? null,
      github: insertUserInfo.github ?? null,
      linkedin: insertUserInfo.linkedin ?? null,
      twitter: insertUserInfo.twitter ?? null,
      languages: insertUserInfo.languages ?? null,
      socialLinks: insertUserInfo.socialLinks ?? null,
      skills: insertUserInfo.skills ?? null,
      resume: insertUserInfo.resume ?? null
    };
    return this.userInfo;
  }

  async updateUserInfo(id: string, updates: Partial<InsertUserInfo>): Promise<UserInfo> {
    if (!this.userInfo) throw new Error("User info not found");
    
    this.userInfo = { 
      ...this.userInfo, 
      ...updates, 
      updatedAt: new Date()
    };
    return this.userInfo;
  }

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = randomUUID();
    this.settings = { 
      ...insertSettings, 
      id,
      updatedAt: new Date(),
      newsletter: insertSettings.newsletter ?? null,
      contactForm: insertSettings.contactForm ?? null,
      theme: insertSettings.theme ?? null
    };
    return this.settings;
  }

  async updateSettings(id: string, updates: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settings) throw new Error("Settings not found");
    
    this.settings = { 
      ...this.settings, 
      ...updates, 
      updatedAt: new Date()
    };
    return this.settings;
  }

  // About
  async getAbout(): Promise<About | undefined> {
    return this.about;
  }

  async createAbout(insertAbout: InsertAbout): Promise<About> {
    const id = randomUUID();
    this.about = { 
      ...insertAbout, 
      id,
      languages: insertAbout.languages ?? null,
      tableOfContentDisplay: insertAbout.tableOfContentDisplay ?? null,
      tableOfContentSubItems: insertAbout.tableOfContentSubItems ?? null,
      avatarDisplay: insertAbout.avatarDisplay ?? null,
      calendarDisplay: insertAbout.calendarDisplay ?? null,
      calendarLink: insertAbout.calendarLink ?? null,
      introDisplay: insertAbout.introDisplay ?? null,
      workDisplay: insertAbout.workDisplay ?? null,
      studiesDisplay: insertAbout.studiesDisplay ?? null,
      technicalDisplay: insertAbout.technicalDisplay ?? null
    };
    return this.about;
  }

  async updateAbout(id: string, updates: Partial<InsertAbout>): Promise<About> {
    if (!this.about) throw new Error("About not found");
    
    this.about = { ...this.about, ...updates };
    return this.about;
  }

  // Social Links
  async getSocialLinks(): Promise<SocialLink[]> {
    return Array.from(this.socialLinks.values()).sort((a, b) => a.order - b.order);
  }

  async createSocialLink(insertSocialLink: InsertSocialLink): Promise<SocialLink> {
    const id = randomUUID();
    const socialLink: SocialLink = { ...insertSocialLink, id };
    this.socialLinks.set(id, socialLink);
    return socialLink;
  }

  async updateSocialLink(id: string, updates: Partial<InsertSocialLink>): Promise<SocialLink> {
    const socialLink = this.socialLinks.get(id);
    if (!socialLink) throw new Error("Social link not found");
    
    const updatedSocialLink: SocialLink = { ...socialLink, ...updates };
    this.socialLinks.set(id, updatedSocialLink);
    return updatedSocialLink;
  }

  async deleteSocialLink(id: string): Promise<void> {
    this.socialLinks.delete(id);
  }

  // Work Experiences
  async getWorkExperiences(): Promise<WorkExperience[]> {
    return Array.from(this.workExperiences.values()).sort((a, b) => a.order - b.order);
  }

  async createWorkExperience(insertWorkExperience: InsertWorkExperience): Promise<WorkExperience> {
    const id = randomUUID();
    const workExperience: WorkExperience = { 
      ...insertWorkExperience, 
      id,
      achievements: insertWorkExperience.achievements ?? null,
      images: insertWorkExperience.images ?? null
    };
    this.workExperiences.set(id, workExperience);
    return workExperience;
  }

  async updateWorkExperience(id: string, updates: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const workExperience = this.workExperiences.get(id);
    if (!workExperience) throw new Error("Work experience not found");
    
    const updatedWorkExperience: WorkExperience = { ...workExperience, ...updates };
    this.workExperiences.set(id, updatedWorkExperience);
    return updatedWorkExperience;
  }

  async deleteWorkExperience(id: string): Promise<void> {
    this.workExperiences.delete(id);
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return Array.from(this.educationItems.values()).sort((a, b) => a.order - b.order);
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = randomUUID();
    const education: Education = { ...insertEducation, id };
    this.educationItems.set(id, education);
    return education;
  }

  async updateEducation(id: string, updates: Partial<InsertEducation>): Promise<Education> {
    const education = this.educationItems.get(id);
    if (!education) throw new Error("Education not found");
    
    const updatedEducation: Education = { ...education, ...updates };
    this.educationItems.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id: string): Promise<void> {
    this.educationItems.delete(id);
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values()).sort((a, b) => a.order - b.order);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = { 
      ...insertSkill, 
      id,
      images: insertSkill.images ?? null
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill> {
    const skill = this.skills.get(id);
    if (!skill) throw new Error("Skill not found");
    
    const updatedSkill: Skill = { ...skill, ...updates };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: string): Promise<void> {
    this.skills.delete(id);
  }
}

export const storage = new MemStorage();
