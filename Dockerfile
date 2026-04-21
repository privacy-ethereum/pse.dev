FROM node:22-alpine as builder
RUN apk add --no-cache git curl

WORKDIR /builder

# Enable corepack before any Yarn operations
RUN corepack enable
RUN corepack prepare yarn@4.7.0 --activate

# Copy manifests, lock file, and yarn config
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies using the lockfile
RUN yarn install --immutable

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Create image by copying build artifacts
FROM node:22-alpine as runner

# Add curl for HEALTHCHECK
RUN apk add --no-cache curl

# Enable corepack in the runner image too
RUN corepack enable
RUN corepack prepare yarn@4.7.0 --activate

USER node

WORKDIR /home/node
COPY --chown=node:node --from=builder /builder/ ./

ARG PORT=3000
# Set PORT env var for next start and expose it
ENV PORT=${PORT}
EXPOSE ${PORT}

# Add internal health check
# Adjust path (e.g., /api/health) if necessary for your app's health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/api/health || exit 1

CMD ["yarn", "start"]
