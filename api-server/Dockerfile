FROM node:alpine

WORKDIR /opt/api-server

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run start
