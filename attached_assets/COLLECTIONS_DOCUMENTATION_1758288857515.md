# Appwrite Collections and Attributes Documentation

This document provides a comprehensive overview of all Appwrite collections used in the portfolio application, their attributes, types, and configurations.

## Database Configuration

- **Project ID**: `68cbe636001f9dbf48fc`
- **Database ID**: `68cbe743001eafab13ed`
- **Endpoint**: `https://fra.cloud.appwrite.io/v1`

## Collections Overview

The portfolio application uses the following main collections:

1. [Projects](#projects-collection)
2. [Blog Posts](#blog-posts-collection)
3. [User Info](#user-info-collection)
4. [Settings](#settings-collection)
5. [About Page Collections](#about-page-collections)
   - [About](#about-collection)
   - [Social Links](#social-links-collection)
   - [Work Experiences](#work-experiences-collection)
   - [Education](#education-collection)
   - [Skills](#skills-collection)

---

## Projects Collection

**Collection ID**: `projects`  
**Collection Name**: `Projects`

### Attributes

| Attribute         | Type    | Size | Required | Default | Array | Description                           |
| ----------------- | ------- | ---- | -------- | ------- | ----- | ------------------------------------- |
| `title`           | string  | 255  | ✅       | -       | ❌    | Project title                         |
| `description`     | string  | 1000 | ✅       | -       | ❌    | Short project description             |
| `longDescription` | string  | 5000 | ❌       | -       | ❌    | Detailed project description          |
| `image`           | string  | 500  | ✅       | -       | ❌    | Project image URL/path                |
| `technologies`    | string  | 1000 | ✅       | -       | ✅    | Array of technologies used            |
| `githubUrl`       | string  | 500  | ❌       | -       | ❌    | GitHub repository URL                 |
| `liveUrl`         | string  | 500  | ❌       | -       | ❌    | Live project URL                      |
| `category`        | string  | 100  | ✅/❌\*  | -       | ❌    | Project category                      |
| `status`          | enum    | -    | ❌       | -       | ❌    | Project status (`published`, `draft`) |
| `featured`        | boolean | -    | ❌       | -       | ❌    | Whether project is featured           |
| `order`           | integer | -    | ❌       | -       | ❌    | Display order                         |
| `year`            | integer | -    | ❌       | -       | ❌    | Project year                          |
| `createdAt`       | string  | 50   | ✅       | -       | ❌    | Creation timestamp                    |
| `updatedAt`       | string  | 50   | ✅       | -       | ❌    | Last update timestamp                 |

\*Note: Category requirement varies between different setup scripts.

### Permissions

- Read: Any user
- Write: Authenticated users
- Update: Authenticated users
- Delete: Authenticated users

---

## Blog Posts Collection

**Collection ID**: `blog-posts`  
**Collection Name**: `Blog Posts`

### Attributes

| Attribute     | Type     | Size  | Required | Default | Array | Description              |
| ------------- | -------- | ----- | -------- | ------- | ----- | ------------------------ |
| `title`       | string   | 255   | ✅       | -       | ❌    | Blog post title          |
| `slug`        | string   | 255   | ✅       | -       | ❌    | URL-friendly identifier  |
| `content`     | string   | 50000 | ✅       | -       | ❌    | Full blog post content   |
| `excerpt`     | string   | 1000  | ❌       | -       | ❌    | Short preview text       |
| `author`      | string   | 100   | ✅       | -       | ❌    | Author name              |
| `publishedAt` | datetime | -     | ✅       | -       | ❌    | Publication date         |
| `updatedAt`   | datetime | -     | ❌       | -       | ❌    | Last update date         |
| `featured`    | boolean  | -     | ❌       | -       | ❌    | Whether post is featured |
| `tags`        | string   | 500   | ❌       | -       | ✅    | Array of tags            |
| `category`    | string   | 100   | ❌       | -       | ❌    | Post category            |
| `image`       | string   | 500   | ❌       | -       | ❌    | Featured image URL       |
| `published`   | boolean  | -     | ❌       | -       | ❌    | Publication status       |

### Permissions

- Read: Any user
- Write: Authenticated users
- Update: Authenticated users
- Delete: Authenticated users

---

## User Info Collection

**Collection ID**: `user-info`  
**Collection Name**: `User Info`

### Attributes (Extended Version)

| Attribute     | Type   | Size | Required | Default | Array | Description                 |
| ------------- | ------ | ---- | -------- | ------- | ----- | --------------------------- |
| `firstName`   | string | 100  | ✅       | -       | ❌    | User's first name           |
| `lastName`    | string | 100  | ✅       | -       | ❌    | User's last name            |
| `name`        | string | 100  | ✅       | -       | ❌    | Full name (alternative)     |
| `title`       | string | 200  | ✅       | -       | ❌    | Professional title          |
| `role`        | string | 200  | ✅       | -       | ❌    | Current role                |
| `bio`         | string | 2000 | ✅/❌\*  | -       | ❌    | User biography              |
| `avatar`      | string | 500  | ❌       | -       | ❌    | Avatar image URL            |
| `location`    | string | 200  | ✅/❌\*  | -       | ❌    | Geographic location         |
| `timezone`    | string | 100  | ✅       | -       | ❌    | User timezone               |
| `email`       | string | 255  | ✅       | -       | ❌    | Email address               |
| `phone`       | string | 50   | ❌       | -       | ❌    | Phone number                |
| `website`     | string | 255  | ❌       | -       | ❌    | Personal website URL        |
| `github`      | string | 255  | ❌       | -       | ❌    | GitHub profile URL          |
| `linkedin`    | string | 255  | ❌       | -       | ❌    | LinkedIn profile URL        |
| `twitter`     | string | 255  | ❌       | -       | ❌    | Twitter profile URL         |
| `languages`   | string | 1000 | ❌       | -       | ✅    | Array of languages          |
| `socialLinks` | string | 2000 | ❌       | -       | ❌    | JSON object of social links |
| `skills`      | string | 1000 | ❌       | -       | ✅    | Array of skills             |
| `resume`      | string | 500  | ❌       | -       | ❌    | Resume file URL             |
| `createdAt`   | string | 50   | ✅       | -       | ❌    | Creation timestamp          |
| `updatedAt`   | string | 50   | ✅       | -       | ❌    | Last update timestamp       |

\*Note: Requirements vary between different setup scripts.

### Permissions

- Read: Any user
- Write: Authenticated users
- Update: Authenticated users
- Delete: Authenticated users

---

## Settings Collection

**Collection ID**: `settings`  
**Collection Name**: `Settings`

### Attributes (Key-Value Version)

| Attribute     | Type   | Size | Required | Default | Array | Description                        |
| ------------- | ------ | ---- | -------- | ------- | ----- | ---------------------------------- |
| `key`         | string | 100  | ✅       | -       | ❌    | Setting key identifier             |
| `value`       | string | 1000 | ✅       | -       | ❌    | Setting value                      |
| `type`        | string | 50   | ✅       | -       | ❌    | Value type (string, boolean, etc.) |
| `description` | string | 500  | ❌       | -       | ❌    | Setting description                |

### Attributes (Site Configuration Version)

| Attribute         | Type   | Size | Required | Default | Array | Description                     |
| ----------------- | ------ | ---- | -------- | ------- | ----- | ------------------------------- |
| `siteName`        | string | 255  | ✅       | -       | ❌    | Website name                    |
| `siteDescription` | string | 1000 | ✅       | -       | ❌    | Website description             |
| `siteUrl`         | string | 500  | ✅       | -       | ❌    | Website URL                     |
| `newsletter`      | string | 2000 | ❌       | -       | ❌    | Newsletter configuration (JSON) |
| `contactForm`     | string | 1000 | ❌       | -       | ❌    | Contact form settings (JSON)    |
| `theme`           | string | 5000 | ❌       | -       | ❌    | Theme configuration (JSON)      |
| `updatedAt`       | string | 50   | ✅       | -       | ❌    | Last update timestamp           |

### Permissions

- Read: Any user
- Write: Authenticated users
- Update: Authenticated users
- Delete: Authenticated users

---

## About Page Collections

The about page uses several specialized collections for structured content management.

### About Collection

**Collection ID**: `about`  
**Collection Name**: `About Page Data`

| Attribute                | Type    | Size | Required | Default | Description                   |
| ------------------------ | ------- | ---- | -------- | ------- | ----------------------------- |
| `firstName`              | string  | 100  | ✅       | -       | User's first name             |
| `lastName`               | string  | 100  | ✅       | -       | User's last name              |
| `role`                   | string  | 200  | ✅       | -       | Professional role             |
| `avatar`                 | string  | 500  | ✅       | -       | Avatar image URL              |
| `location`               | string  | 100  | ✅       | -       | Geographic location           |
| `languages`              | string  | 1000 | ❌       | -       | Spoken languages (JSON array) |
| `title`                  | string  | 200  | ✅       | -       | Page title                    |
| `description`            | string  | 1000 | ✅       | -       | Page description              |
| `tableOfContentDisplay`  | boolean | -    | ❌       | `true`  | Show table of contents        |
| `tableOfContentSubItems` | boolean | -    | ❌       | `false` | Show sub-items in TOC         |
| `avatarDisplay`          | boolean | -    | ❌       | `true`  | Display avatar                |
| `calendarDisplay`        | boolean | -    | ❌       | `false` | Show calendar integration     |
| `calendarLink`           | string  | 500  | ❌       | -       | Calendar booking URL          |
| `introDisplay`           | boolean | -    | ❌       | `true`  | Show introduction section     |
| `introTitle`             | string  | 200  | ✅       | -       | Introduction section title    |
| `introDescription`       | string  | 2000 | ✅       | -       | Introduction content          |
| `workDisplay`            | boolean | -    | ❌       | `true`  | Show work section             |
| `workTitle`              | string  | 200  | ✅       | -       | Work section title            |
| `studiesDisplay`         | boolean | -    | ❌       | `true`  | Show education section        |
| `studiesTitle`           | string  | 200  | ✅       | -       | Education section title       |
| `technicalDisplay`       | boolean | -    | ❌       | `true`  | Show skills section           |
| `technicalTitle`         | string  | 200  | ✅       | -       | Skills section title          |

### Social Links Collection

**Collection ID**: `social_links`  
**Collection Name**: `Social Media Links`

| Attribute | Type    | Size | Required | Default | Description     |
| --------- | ------- | ---- | -------- | ------- | --------------- |
| `name`    | string  | 100  | ✅       | -       | Platform name   |
| `icon`    | string  | 100  | ✅       | -       | Icon identifier |
| `url`     | string  | 500  | ✅       | -       | Profile URL     |
| `order`   | integer | -    | ✅       | -       | Display order   |

### Work Experiences Collection

**Collection ID**: `work_experiences`  
**Collection Name**: `Work Experience`

| Attribute      | Type    | Size | Required | Default | Description                   |
| -------------- | ------- | ---- | -------- | ------- | ----------------------------- |
| `company`      | string  | 200  | ✅       | -       | Company name                  |
| `timeframe`    | string  | 100  | ✅       | -       | Employment period             |
| `role`         | string  | 200  | ✅       | -       | Job title                     |
| `achievements` | string  | 5000 | ❌       | -       | Key achievements (JSON array) |
| `images`       | string  | 5000 | ❌       | -       | Related images (JSON array)   |
| `order`        | integer | -    | ✅       | -       | Display order                 |

### Education Collection

**Collection ID**: `education`  
**Collection Name**: `Education`

| Attribute     | Type    | Size | Required | Default | Description                |
| ------------- | ------- | ---- | -------- | ------- | -------------------------- |
| `name`        | string  | 200  | ✅       | -       | Institution name           |
| `description` | string  | 1000 | ✅       | -       | Degree/program description |
| `order`       | integer | -    | ✅       | -       | Display order              |

### Skills Collection

**Collection ID**: `skills`  
**Collection Name**: `Technical Skills`

| Attribute     | Type    | Size | Required | Default | Description                 |
| ------------- | ------- | ---- | -------- | ------- | --------------------------- |
| `title`       | string  | 200  | ✅       | -       | Skill category title        |
| `description` | string  | 1000 | ✅       | -       | Skill description           |
| `images`      | string  | 5000 | ❌       | -       | Related images (JSON array) |
| `order`       | integer | -    | ✅       | -       | Display order               |

---

## Permission Configuration

All collections generally follow this permission pattern:

```typescript
[
  Permission.read(Role.any()), // Public read access
  Permission.write(Role.users()), // Authenticated users can write
  Permission.update(Role.users()), // Authenticated users can update
  Permission.delete(Role.users()), // Authenticated users can delete
];
```

Some collections may have more restrictive permissions depending on the specific setup script used.

---

## Setup Scripts Reference

The following scripts are available for managing these collections:

- `setup-appwrite.ts` - Main collection setup
- `setup-appwrite-clean.ts` - Clean setup with organized attributes
- `setup-about-collections.ts` - About page collections setup
- `recreate-collections.ts` - Recreation utility
- `list-collections.ts` - List existing collections
- `set-permissions.ts` - Permission management
- `fix-permissions.ts` - Permission repair utility

---

## Notes

1. **Array Fields**: Fields marked as arrays store JSON-serialized arrays as strings
2. **JSON Fields**: Some fields store JSON objects as strings (e.g., `socialLinks`, `achievements`)
3. **Version Differences**: Different setup scripts may have slightly different attribute requirements
4. **Timestamps**: Creation and update timestamps are managed manually in the application
5. **Enum Values**: Status enums include `"published"` and `"draft"`

This documentation reflects the current state of collection schemas as defined in the setup scripts. Always refer to the latest setup scripts for the most current configuration.
