FROM node:18.12.1-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm@7.24.2 && npm cache clean --force

RUN pnpm install

COPY . .

RUN pnpm run tsc

FROM node:18.12.1-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm@7.24.2 && npm cache clean --force

RUN pnpm install --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]