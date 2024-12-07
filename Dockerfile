FROM --platform=${BUILDPLATFORM:-linux/amd64} node:22-bookworm-slim AS base

FROM base AS deps
ARG APP_NAME=frontend

WORKDIR /app

# Install dependencies
COPY apps/$APP_NAME/package.json apps/$APP_NAME/tsconfig.json apps/$APP_NAME/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable
RUN pnpm --config.update-notifier=false install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
ARG APP_NAME=frontend

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules/
COPY --from=deps /app/apps/$APP_NAME/node_modules ./apps/$APP_NAME/node_modules/
COPY package.json pnpm-lock.yaml ./
COPY apps/$APP_NAME ./apps/$APP_NAME/
RUN corepack enable
WORKDIR /app/apps/$APP_NAME

# Set environment variables such as NEXT_PUBLIC_XXX
ARG NEXT_PUBLIC_AG_GRID_LICENSE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_TAILOR_PF_URL
ARG NEXT_PUBLIC_TAILOR_PF_CLIENT_ID
ARG NEXT_PUBLIC_TAILOR_PF_CLIENT_SECRET

ENV NEXT_PUBLIC_AG_GRID_LICENSE_KEY=$NEXT_PUBLIC_AG_GRID_LICENSE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_TAILOR_PF_URL=$NEXT_PUBLIC_TAILOR_PF_URL
ENV NEXT_PUBLIC_TAILOR_PF_CLIENT_ID=$NEXT_PUBLIC_TAILOR_PF_CLIENT_ID
ENV NEXT_PUBLIC_TAILOR_PF_CLIENT_SECRET=$NEXT_PUBLIC_TAILOR_PF_CLIENT_SECRET

RUN pnpm run build

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove the sourcemaps files so they're not accessible to clients
RUN find .next -type f -name '*.map' -exec rm {} \;

# Production image, copy all the files and run next
FROM --platform=${BUILDPLATFORM:-linux/amd64} gcr.io/distroless/nodejs22-debian12 AS runner
ARG APP_NAME=stock-client

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/standalone ./
WORKDIR /app/apps/$APP_NAME
COPY --from=builder --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/static ./.next/static
COPY --from=builder /app/apps/$APP_NAME/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["server.js"]