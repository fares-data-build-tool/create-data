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

RUN apk update && apk upgrade && apk add --no-cache -t .clamv-run-deps openrc clamav clamav-daemon clamav-libunrar && \
    npm install --ignore-scripts && mkdir /run/clamav && chown -R clamav:clamav /run/clamav && freshclam

COPY --from=build /tmp/.next ./.next
COPY --from=build /tmp/dist ./dist

EXPOSE 80

CMD ["sh", "-c", "sleep 20 && (freshclam && (clamd -F & freshclam -d)) & npm start"]
