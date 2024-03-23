# syntax = docker/dockerfile:1
FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

RUN apk --no-cache add brotli

RUN corepack enable pnpm
COPY . .
RUN pnpm --filter "@wsh-2024/client" install
ENV NODE_ENV production
RUN pnpm --filter "@wsh-2024/client" build

RUN find ./workspaces/client/dist | xargs -I {} sh -c 'gzip -9 -v -k -c {} > {}.gz'

FROM caddy:2.7.2-alpine

COPY --from=builder /usr/src/app/workspaces/client/dist /usr/share/caddy/
COPY ./deploy/Caddyfile /etc/caddy/Caddyfile

ENTRYPOINT ["caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
