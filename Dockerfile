FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build
