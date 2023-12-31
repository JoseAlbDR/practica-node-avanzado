FROM node:20-alpine as development
WORKDIR /app
COPY package.json package.json
RUN npm install
CMD ["npm", "run", "dev"]

FROM node:20-alpine as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:20-alpine as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:20-alpine as production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/app.js"]




