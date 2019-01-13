FROM node:8.15.0-alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn build:front
CMD ["yarn", "server"]

## stage 2

#FROM node:8.15.0-alpine

#WORKDIR /usr/src/app

#COPY --from=builder /usr/src/app/lib ./lib
#COPY --from=builder /usr/src/app/servers ./servers
#COPY --from=builder /usr/src/app/view ./view
#COPY ./package.json ./

#RUN yarn install --production=true
#COPY --from=builder ./.env .

#CMD ["node", "lib/index.js"]