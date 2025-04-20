FROM node:20-alpine as builder
RUN apk add --no-cache git curl

WORKDIR /builder

# Copy manifests, lock file, and yarn config
COPY package.json yarn.lock .yarnrc.yml ./

# Enable corepack and install dependencies using the lockfile
RUN corepack enable
RUN yarn install --immutable

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Create image by copying build artifacts
FROM node:20-alpine as runner

# Add curl for HEALTHCHECK
RUN apk add --no-cache curl

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
  CMD curl --fail http://localhost:${PORT}/ || exit 1

CMD ["yarn", "start"]
