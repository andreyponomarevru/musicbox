FROM node:12

WORKDIR /opt/client

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run serve
