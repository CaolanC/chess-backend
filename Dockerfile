# pull in the package manifests
FROM node:lts-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install


FROM base AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src/ ./src
RUN npx tsc

# FROM node:lts-alpine AS front
# WORKDIR /app/front
# COPY front/package*.json ./
# COPY front/tsconfig.json ./

# RUN npm install


# take only necessary prod deps
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# the finished package
FROM node:lts-alpine AS final
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
CMD ["npm", "start"]