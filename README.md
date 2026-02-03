# Privacy Stewards of Ethereum

Enhancing Ethereum through cryptographic research and collective experimentation.

## Contributing guidelines

### Open for contribution.

- For adding new features, please open PR and first merge to staging/dev for QA, or open issue for suggestion, bug report.
- For any misc. update such as typo, PR to main and two approval is needed.

### Add/Edit article

- For updating/adding a new article [you can follow this guide](content/articles/README.md)

### Add/Edit project list

- For updating/adding project detail [you can follow this guide](content/projects/README.md)

## PR Review process

- Translation PRs: Please tag a member who can help review your translation.
- All PRs: Kindly clearly state your intention or the purpose of the pull request.
- Suggestions: If you have any suggestions, feel free to open an issue.

## Run Locally

Clone the project

```commandline
  git clone https://github.com/privacy-ethereum/pse.dev
```

Go to the project directory

```commandline
  cd pse.dev
```

Install dependencies

```commandline
  yarn
```

Start the app

```commandline
  yarn dev
```

## Tech Stack

[@shadcn's Nextjs 13 template](https://github.com/shadcn/next-template)

- Next.js 14 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Tailwind CSS class sorting, merging and linting.

## Testing

Quick commands:

```bash
# Run all tests (CI mode)
yarn test:run

# Watch mode (dev)
yarn test:watch

# UI runner
yarn test:ui

# Coverage report
yarn test:coverage

# Validate setup (sanity checks)
yarn test:validation
```

Notes:

- Tests live in `tests/` with utilities in `tests/test-utils.tsx`.
- Mocks are under `tests/mocks/` (Next components, browser APIs, external libs).
- Use the custom render from `@/tests/test-utils` to get providers.
- Path alias `@/` points to project root.
- jsdom environment is preconfigured.
