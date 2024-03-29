FROM node:10.16.0-slim
WORKDIR /app
COPY ./package.json /app
RUN npm install -g sequelize-cli
RUN npm install
COPY . /app
