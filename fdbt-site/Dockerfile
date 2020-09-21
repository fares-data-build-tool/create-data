FROM node:12-alpine AS build

WORKDIR /tmp

COPY package*.json ./
RUN apk add --no-cache git && npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --ignore-scripts && apk update && apk upgrade && apk add --no-cache -t .clamv-run-deps openrc clamav clamav-daemon clamav-libunrar && \
    openrc default && rc-update add freshclam && rc-update add clamd

COPY --from=build /tmp/.next ./.next
COPY --from=build /tmp/dist ./dist

EXPOSE 80

CMD ["npm", "start"]
