FROM node:12-alpine

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --silent

COPY . .
RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]
