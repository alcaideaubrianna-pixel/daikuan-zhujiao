
FROM node:22-trixie-slim AS build
ENV CI=true
WORKDIR /app
RUN npm install --global pnpm@10.17.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/admin/package.json web/admin/pnpm-lock.yaml ./web/admin/
COPY web/h5/package.json web/h5/pnpm-lock.yaml ./web/h5/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:server

FROM node:22-trixie-slim AS runtime
ENV NODE_ENV=production TZ=Asia/Shanghai
WORKDIR /app
RUN mkdir -p /home/node/.cool-admin && chown node:node /home/node/.cool-admin
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/bootstrap.js ./bootstrap.js
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
EXPOSE 8001
CMD ["node", "bootstrap.js"]
