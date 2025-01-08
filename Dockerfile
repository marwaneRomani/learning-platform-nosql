FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .