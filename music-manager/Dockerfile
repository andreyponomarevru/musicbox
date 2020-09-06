FROM node:alpine

WORKDIR /opt/music-manager

COPY package*.json ./
RUN npm install

COPY . .

CMD npm link
CMD npm run start
