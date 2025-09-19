# Portfolio Admin System

## Overview

This is a full-stack portfolio management system built as a modern web application. The system enables portfolio owners to manage their projects, blog posts, personal information, and website settings through a comprehensive admin dashboard. The application follows a client-server architecture with a React-based frontend and Express backend, utilizing PostgreSQL for data persistence and Appwrite for authentication services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side is built with React 18 using TypeScript and follows a component-based architecture:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

The frontend implements a single-page application with protected routes, featuring an admin dashboard with multiple management sections (projects, blog, profile, settings). The design system uses a dark theme with CSS custom properties for theming consistency.

### Backend Architecture

The server-side uses Express.js with TypeScript in a RESTful API design:

- **Framework**: Express.js with TypeScript for the REST API
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type checking and validation
- **Development**: Hot reloading with Vite integration for seamless development

The API follows RESTful conventions with dedicated routes for each resource (projects, blog posts, user info, settings). The storage layer abstracts database operations through an interface pattern.

### Data Architecture

The database schema supports a comprehensive portfolio system:

- **Projects**: Title, description, technologies, GitHub/live URLs, categories, and metadata
- **Blog Posts**: Content management with markdown support, tags, categories, and publishing workflow
- **User Information**: Personal details, bio, contact information, and social links
- **Settings**: Site-wide configuration options
- **About Page Data**: Structured content for about sections including work experience, education, and skills

All tables include automatic UUID generation and timestamp tracking for created/updated dates.

### Authentication & Security

Authentication is handled through Appwrite services:

- **Provider**: Appwrite cloud authentication
- **Method**: Email/password sessions with secure cookie management
- **Protection**: Route-level authentication guards
- **Session Management**: Automatic session validation and renewal

### Development & Deployment

The application is configured for modern development workflows:

- **Monorepo Structure**: Shared types and schemas between client and server
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Hot Reloading**: Development server with instant updates
- **Build Process**: Vite builds the client, esbuild bundles the server
- **Database Migrations**: Drizzle Kit for schema management

## External Dependencies

### Core Services
- **Appwrite**: Authentication and user management (fra.cloud.appwrite.io)
- **PostgreSQL**: Primary database (via Neon serverless)
- **Drizzle ORM**: Database query builder and migration tool

### UI and Styling
- **Radix UI**: Accessible component primitives (@radix-ui/*)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation and type generation

### Database Configuration
- Database connection via environment variable (DATABASE_URL)
- Migrations stored in ./migrations directory
- Schema definitions in shared/schema.ts for type consistency