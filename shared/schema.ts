import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  category: text("category").notNull(),
  status: text("status").default("published"),
  featured: boolean("featured").default(false),
  order: integer("order"),
  year: integer("year"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
  featured: boolean("featured").default(false),
  tags: text("tags").array(),
  category: text("category"),
  image: text("image"),
  published: boolean("published").default(false),
});

export const userInfo = pgTable("user_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  location: text("location"),
  timezone: text("timezone").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  languages: text("languages").array(),
  socialLinks: text("social_links"),
  skills: text("skills").array(),
  resume: text("resume"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteName: text("site_name").notNull(),
  siteDescription: text("site_description").notNull(),
  siteUrl: text("site_url").notNull(),
  newsletter: text("newsletter"),
  contactForm: text("contact_form"),
  theme: text("theme"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const about = pgTable("about", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar").notNull(),
  location: text("location").notNull(),
  languages: text("languages"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tableOfContentDisplay: boolean("table_of_content_display").default(true),
  tableOfContentSubItems: boolean("table_of_content_sub_items").default(false),
  avatarDisplay: boolean("avatar_display").default(true),
  calendarDisplay: boolean("calendar_display").default(false),
  calendarLink: text("calendar_link"),
  introDisplay: boolean("intro_display").default(true),
  introTitle: text("intro_title").notNull(),
  introDescription: text("intro_description").notNull(),
  workDisplay: boolean("work_display").default(true),
  workTitle: text("work_title").notNull(),
  studiesDisplay: boolean("studies_display").default(true),
  studiesTitle: text("studies_title").notNull(),
  technicalDisplay: boolean("technical_display").default(true),
  technicalTitle: text("technical_title").notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull(),
});

export const workExperiences = pgTable("work_experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  company: text("company").notNull(),
  timeframe: text("timeframe").notNull(),
  role: text("role").notNull(),
  achievements: text("achievements"),
  images: text("images"),
  order: integer("order").notNull(),
});

export const education = pgTable("education", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  images: text("images"),
  order: integer("order").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true,
});

export const insertUserInfoSchema = createInsertSchema(userInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertAboutSchema = createInsertSchema(about).omit({
  id: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
});

export const insertWorkExperienceSchema = createInsertSchema(workExperiences).omit({
  id: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertUserInfo = z.infer<typeof insertUserInfoSchema>;
export type UserInfo = typeof userInfo.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type About = typeof about.$inferSelect;

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;

export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type WorkExperience = typeof workExperiences.$inferSelect;

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
