FROM node:lts-alpine AS builder
WORKDIR /var/bot

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn build

# RUNNER
FROM node:lts-alpine AS runner
WORKDIR /var/bot

COPY package.json yarn.lock ./
ARG NODE_ENV=production
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=builder /var/bot/dist/ ./

RUN adduser -S bot
USER bot

ENTRYPOINT [ "node", "index.js" ]