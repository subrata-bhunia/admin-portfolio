import { Client, Databases, Account } from 'appwrite';

const client = new Client();

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '68cbe636001f9dbf48fc';
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '68cbe743001eafab13ed';

client
  .setEndpoint(endpoint)
  .setProject(projectId);

export const databases = new Databases(client);
export const account = new Account(client);

export { client, databaseId };

export const COLLECTION_IDS = {
  PROJECTS: 'projects',
  BLOG_POSTS: 'blog-posts',
  USER_INFO: 'user-info',
  SETTINGS: 'settings',
  ABOUT: 'about',
  SOCIAL_LINKS: 'social_links',
  WORK_EXPERIENCES: 'work_experiences',
  EDUCATION: 'education',
  SKILLS: 'skills',
};
