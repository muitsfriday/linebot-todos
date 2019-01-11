FROM node:8.15.0-alpine AS builder

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./.babelrc ./
#COPY ./.env ./
COPY ./.eslintrc.js ./
COPY ./.eslintignore ./
COPY ./src ./src

RUN yarn install
RUN yarn build
CMD ["node", "lib/index.js"]

## stage 2

#FROM node:8.15.0-alpine

#WORKDIR /usr/src/app

#COPY --from=builder /usr/src/app/lib .
#COPY --from=builder ./.env .

#CMD ["node", "index.js"]