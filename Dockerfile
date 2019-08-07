FROM node:10.16.0-alpine
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
