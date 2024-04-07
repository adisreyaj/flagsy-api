FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app

# Get all the code needed to run the app
COPY . /app

RUN npm install
RUN npm run build
