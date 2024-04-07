FROM node:lts-alpine

# Create app directory
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
