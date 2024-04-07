FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app

# Get all the code needed to run the app
COPY . .

RUN npm run prod
RUN npm run build
