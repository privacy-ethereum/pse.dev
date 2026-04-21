---
# ========================================
# REQUIRED PROPERTIES
# ========================================
id: "project-id" # Unique project identifier (string)
name: "Project Name" # Project display name (string)
image: "/projects/project-folder/cover.webp" # Project cover image path (string)
section: "pse" # Project section: "pse" | "grant" | "collaboration" | "archived"
projectStatus: "active" # Project status: "active" | "inactive" | "maintained"
tldr: "Brief project summary" # Short description of the project

# ========================================
# OPTIONAL PROPERTIES - Remove if not needed
# ========================================
imageAlt: "Alt text for the image" # Alt text for the image
previousBrandImage: "/projects/project-folder/old-cover.webp" # Previous brand image
category: "research" # Project category: "research" | "applications" | "devtools"
license: "MIT" # Project license
hasWiki: false # Whether project has wiki page template
youtubeLinks: # Array of YouTube links
  - "https://www.youtube.com/watch?v=example"
tags: # Project tags
  keywords: ["tag1", "tag2", "tag3"] # Relevant keywords
  themes: ["privacy", "scalability"] # Project themes
  types: ["research", "development"] # Project types
  builtWith: ["typescript", "react"] # Technologies used
  fundingSource: ["pse", "grants"] # Funding sources
links: # Project links
  github: "https://github.com/org/repo"
  website: "https://project-website.com"
  discord: "https://discord.gg/invite"
  twitter: "https://twitter.com/project"
  youtube: "https://youtube.com/@project"
  telegram: "https://t.me/project"
extraLinks: # Extra action links
  buildWith:
    - label: "Build with this"
      url: "https://example.com/build"
  play:
    - label: "Try it out"
      url: "https://example.com/demo"
  research:
    - label: "Read the paper"
      url: "https://example.com/paper"
  learn:
    - label: "Learn more"
      url: "https://example.com/docs"
cardTags: # Tags displayed on project cards
  primary: "Primary Tag"
  secondary: "Secondary Tag"
team: # Project team members
  - name: "Team Member Name"
    role: "Developer" # (Optional)
    email: "member@example.com" # (Optional)
    image: "/team/member.webp" # (Optional)
    links: # Team member links
      github: "https://github.com/member"
      twitter: "https://twitter.com/member"
---

# Project Title

## Overview

Brief overview of what the project does and why it matters.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

Detailed technical information about the project implementation.

## Getting Started

Instructions on how to use or contribute to the project.

## Resources

- [Documentation](https://example.com/docs)
- [GitHub Repository](https://github.com/org/repo)
- [Research Paper](https://example.com/paper)

## Contact

For questions or contributions, reach out to the team members listed above.
