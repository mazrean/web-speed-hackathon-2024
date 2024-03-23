# syntax = docker/dockerfile:1
FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable pnpm
COPY . .
RUN pnpm install
RUN pnpm build

# syntax = docker/dockerfile:1
FROM node:20.11.1-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

RUN apk --no-cache add jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.

RUN corepack enable pnpm

COPY --from=builder /usr/src/app/workspaces/server/package.json /usr/src/app/workspaces/server/package.json
COPY --from=builder /usr/src/app/workspaces/server/dist /usr/src/app/workspaces/server/dist
COPY --from=builder /usr/src/app/workspaces/server/seeds /usr/src/app/workspaces/server/seeds
COPY --from=builder /usr/src/app/workspaces/client/dist /usr/src/app/workspaces/client/dist
COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml /usr/src/app/pnpm-workspace.yaml

ENV PORT 8000
EXPOSE 8000

ENTRYPOINT ["pnpm"]
CMD ["start"]
