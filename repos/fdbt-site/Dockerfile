FROM node:12-alpine AS build

WORKDIR /tmp

COPY package*.json ./
RUN apk add --no-cache git && npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

COPY package*.json start_clamav.sh ./
COPY supervisord.conf /etc/supervisor/

RUN apk update && apk upgrade && \
    apk add --no-cache -t .clamv-run-deps openrc clamav clamav-daemon clamav-libunrar supervisor && \
    npm install --ignore-scripts && \
    mkdir /run/clamav && \
    chown clamav:clamav /run/clamav && \
    chmod 750 /run/clamav && \
    mkdir -p /var/lib/clamav/ && \
    chown -R clamav:clamav /var/lib/clamav/ && \
    mkdir -p  /var/log/supervisor && \
    chmod -R 0777 /var/log/supervisor && \
    chmod +x /home/node/app/start_clamav.sh && \
    sed -i 's/^#Foreground yes/Foreground yes/g' /etc/clamav/clamd.conf && \
    sed -i 's/^#Foreground yes/Foreground yes/g' /etc/clamav/freshclam.conf && \
    freshclam --stdout

COPY --from=build /tmp/.next ./.next
COPY --from=build /tmp/dist ./dist

EXPOSE 80

CMD ["supervisord",  "-c",  "/etc/supervisor/supervisord.conf", "-n"]
