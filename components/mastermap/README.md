# PSE Master Map

The Master Map is a consolidated view of PSE's highest-priority initiatives across three tracks: **Private Proving**, **Private Writes**, and **Private Reads**. It lives at [pse.dev/mastermap](https://pse.dev/mastermap).

Each project shows its current status, completion percentage, and a **Now / Next / Later** roadmap so anyone can see what's in flight, what's coming, and what's on the horizon.

## How it works

All mastermap data is defined in TypeScript files in this directory:

| File | Contents |
|------|----------|
| `mastermap-data.ts` | Main data file with interfaces, categories, and most project entries |
| `tlsnotary-data.ts` | TLSNotary project data (extracted for size) |
| `zkid-data.ts` | zkID project data (extracted for size) |

The pages that render this data live in `app/(pages)/mastermap/`.

## How to update your project

1. **Fork the repo** and create a branch (e.g., `docs/update-mopro-mastermap`).

2. **Find your project** in `mastermap-data.ts` (or its own data file if extracted).

3. **Edit the fields** you need to update. The most common updates are:
   - `status` / `statusVariant` -- overall project status
   - `completion` -- percentage (0-100)
   - `now[]`, `next[]`, `later[]` -- roadmap items
   - `kpis[]` -- key performance indicators

4. **Open a PR** against `main`. Tag your track lead as reviewer.

### Data model reference

Every project follows the `ProjectData` interface:

```typescript
interface ProjectData {
  id: string                // URL slug (e.g., "csp", "mopro")
  name: string              // Display name
  category: CategoryId      // "private-proving" | "private-writes" | "private-reads"
  status: string            // Free text (e.g., "Active R&D", "Production")
  statusVariant: string     // One of: "active" | "rd" | "research" | "planned" | "production" | "ecosystem" | "maintenance"
  completion: number        // 0-100
  description: string       // One-line summary shown on the card
  href: string | null       // "/mastermap/{id}" for detail page, or null if no detail page
  tags: string[]            // Short labels shown on the card
  now: RoadmapItem[]        // Currently in progress
  next: RoadmapItem[]       // Planned next
  later: RoadmapItem[]      // On the horizon
  details?: {               // Optional, shown on the detail page
    description: string[]
    deliverables: string[]
    impact: string[]
  }
  kpis?: {                  // Optional KPI table
    label: string
    target: string
    status: string
  }[]
  projectUrl?: string       // Link to external project site
}
```

Each roadmap item:

```typescript
interface RoadmapItem {
  name: string
  description: string
  status: string            // Free text (e.g., "In progress", "Planned", "Q4 2026")
  statusDot: "green" | "yellow" | "gray" | "blue"
}
```

### Status dot meanings

| Dot | Meaning |
|-----|---------|
| `green` | Actively in progress |
| `yellow` | Planned / upcoming |
| `gray` | Future / tentative |
| `blue` | Contingent on external factors |

### Extracting large projects to their own file

If your project data is getting long (50+ lines), extract it to a separate file:

1. Create `{project-id}-data.ts` in this directory.
2. Export a single `const` of type `ProjectData`.
3. Import it in `mastermap-data.ts` and add it to the `PROJECTS` array.

See `tlsnotary-data.ts` or `zkid-data.ts` for examples.

## Categories

| Track | ID | Lead |
|-------|----|------|
| Private Proving | `private-proving` | Zoey |
| Private Writes | `private-writes` | Thore |
| Private Reads | `private-reads` | Ali |

## Questions?

Open an issue on this repo or reach out to Andy Guzman.
