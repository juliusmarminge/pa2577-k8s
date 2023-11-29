FROM node:20-slim AS base
# FROM --platform=linux/amd64 node:20-slim AS base
WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install

FROM build-deps AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]