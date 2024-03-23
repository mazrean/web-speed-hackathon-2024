# syntax = docker/dockerfile:1
FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable pnpm
COPY . .
RUN pnpm install
ENV NODE_ENV production
RUN pnpm build

FROM node:20.11.1-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

RUN apk --no-cache add jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.

RUN corepack enable pnpm

COPY --from=builder /usr/src/app/workspaces/server/package.json  /usr/src/app/workspaces/server/index.html ./workspaces/server/
COPY --from=builder /usr/src/app/workspaces/server/dist ./workspaces/server/dist/
COPY --from=builder /usr/src/app/workspaces/server/seeds ./workspaces/server/seeds/
COPY --from=builder /usr/src/app/workspaces/client/dist ./workspaces/client/dist/
COPY --from=builder /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml /usr/src/app/pnpm-workspace.yaml /usr/src/app/

RUN pnpm --filter "@wsh-2024/server" install --prod

ENV PORT 8000
EXPOSE 8000

ENTRYPOINT ["pnpm"]
CMD ["start"]
