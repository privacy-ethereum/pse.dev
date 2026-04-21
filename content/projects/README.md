# How to Add a New Project to the Projects List

## 1. Create a New Project Markdown File:

- Go to the `/content/projects` folder in your project.
- Create a new file named `[project-name].md`
- Use the `_project-template.md` file as your starting point

## 2. Add Project Frontmatter:

- Open the newly created `[project-name].md` file.
- Copy the frontmatter from `_project-template.md` and customize it with your project details:

```markdown
---
# ========================================
# REQUIRED PROPERTIES
# ========================================
id: "your-project-id" # Unique project identifier (string)
name: "Your Project Name" # Project display name (string)
image: "/projects/your-project/cover.webp" # Project cover image path (string)
section: "pse" # Project section: "pse" | "grant" | "collaboration" | "archived"
projectStatus: "active" # Project status: "active" | "inactive" | "maintained"
tldr: "Brief project summary" # Short description of the project

# ========================================
# OPTIONAL PROPERTIES - Remove if not needed
# ========================================
category: "research" # Project category: "research" | "devtools" | "application"
license: "MIT" # Project license
graduated: false # Project graduated
tags: # Project tags
  keywords: ["tag1", "tag2", "tag3"] # Relevant keywords
  themes: ["privacy", "scalability"] # Project themes
  types: ["research", "development"] # Project types
  builtWith: ["typescript", "react"] # Technologies used
links: # Project links
  github: "https://github.com/org/repo"
  website: "https://project-website.com"
  discord: "https://discord.gg/invite"
team: # Project team members
  - name: "Team Member Name"
    role: "Developer" # (Optional)
    email: "member@example.com" # (Optional)
    image: "/team/member.webp" # (Optional)
    links: # Team member links
      github: "https://github.com/member"
      twitter: "https://twitter.com/member"
---

# Your Project Title

Your project content goes here using **Markdown** formatting.
```

**Note**: All properties in the frontmatter use YAML syntax. Remove any optional properties you don't need. The content below the frontmatter uses standard Markdown formatting.

#### 3. Project Sections and Properties:

**Required Properties:**

- `id`: Unique project identifier (kebab-case)
- `name`: Display name of the project
- `image`: Path to project cover image
- `section`: Project category ("pse", "grant", "collaboration", "archived")
- `projectStatus`: Current status ("active", "inactive", "maintained")
- `tldr`: Brief one-line description

**Optional Properties:**

- `category`: Project type ("research", "devtools", "application")
- `license`: Project license (e.g., "MIT", "Apache-2.0")
- `hasWiki`: Boolean for wiki page template
- `youtubeLinks`: Array of YouTube video URLs
- `tags`: Object with keywords, themes, types, builtWith, fundingSource arrays
- `links`: Object with social/project links (github, website, discord, etc.)
- `extraLinks`: Categorized action links (buildWith, play, research, learn)
- `team`: Array of team member objects with name, role, email, image, links

That's it! Your new project will now be visible in the projects list.

## Project Status Values

- `active`: Currently being developed
- `inactive`: Not actively maintained
- `maintained`: Stable, receiving updates as needed

## Project Categories

- `research`: Research-focused projects
- `devtools`: Developer tools and utilities
- `application`: Application projects

## Project Sections

- `pse`: Privacy Stewards of Ethereum projects
- `grant`: Grant-funded projects
- `collaboration`: Collaborative projects
- `archived`: Archived/historical projects

## Adding Extra Links to Project Pages

To add action links to your project page, use the `extraLinks` property in your frontmatter:

```yaml
extraLinks:
  buildWith:
    - label: "Get Started Building"
      url: "https://github.com/org/repo#quick-start"
    - label: "API Documentation"
      url: "https://docs.example.com"
  play:
    - label: "Try the Demo"
      url: "https://demo.example.com"
    - label: "Interactive Tutorial"
      url: "https://tutorial.example.com"
  research:
    - label: "Read the Paper"
      url: "https://papers.example.com"
    - label: "Technical Specifications"
      url: "https://specs.example.com"
  learn:
    - label: "Documentation"
      url: "https://docs.example.com"
    - label: "Video Tutorials"
      url: "https://youtube.com/playlist"
```

This creates themed link sections on your project detail page:

![Project links](/public/project/example-project-detail.webp)

## Adding YouTube Videos to a Project

Add YouTube videos to your project by including a `youtubeLinks` array in the frontmatter:

```yaml
youtubeLinks:
  - "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  - "https://youtu.be/XXXXXXXXXXX"
  - "XXXXXXXXXXX" # Just the YouTube video ID
```

The videos will appear as clickable thumbnails with titles on the project page:

![YouTube Videos](/public/project/example-project-video.webp)

## Adding Team Members to a Project

Add team members to your project using the `team` array in the frontmatter:

```yaml
team:
  - name: "John Doe"
    role: "Lead Developer" # Optional
    image: "/team/john-doe.webp" # Optional
    email: "john.doe@example.com" # Optional
    links: # Optional
      github: "https://github.com/johndoe"
      twitter: "https://twitter.com/johndoe"
      website: "https://johndoe.dev"
      discord: "johndoe#1234"
```

Supported link types: `github`, `website`, `discord`, `twitter`, `youtube`, `telegram`

![Project Team Members](/public/project/example-project-team.webp)

## Tags and Themes

The `tags` object supports several categories:

- `keywords`: Technical keywords and concepts
- `themes`: High-level project themes (privacy, scalability, etc.)
- `types`: Project types (research, application, protocol, etc.)
- `builtWith`: Technologies and tools used
- `fundingSource`: Funding sources (pse, grants, etc.)

```yaml
tags:
  keywords: ["MPC", "TypeScript", "privacy", "Garbled Circuits"]
  themes: ["privacy", "buildWith", "play", "research"]
  types: ["protocol", "toolkit"]
  builtWith: ["TypeScript", "Node.js", "React"]
  fundingSource: ["pse"]
```

## Content Formatting

The content below the frontmatter supports full **Markdown** formatting including:

- Headers (`#`, `##`, `###`)
- **Bold** and _italic_ text
- [Links](https://example.com)
- Lists (bulleted and numbered)
- Code blocks with syntax highlighting
- Tables
- Images

### Project Detail Page Features

Your markdown project file now supports:

- Rich markdown content formatting
- Embedded YouTube videos
- Team member profiles with social links
- Categorized action links
- Responsive image handling
- SEO-optimized metadata

**Note**: Keywords and themes are curated by the communications & design team. If you wish to add new ones, please create a PR for review.
