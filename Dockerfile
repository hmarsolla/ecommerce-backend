FROM node:20.12.0

WORKDIR /src

ADD . /src/

RUN npm ci

EXPOSE 3000

CMD [ "npx", "tsx", "src/index.ts" ]
