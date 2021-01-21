#FROM rust AS builder
#
FROM node:erbium

WORKDIR /usr/app/crawler

COPY . /usr/app/crawler

RUN npm install 

CMD ["npm", "start"]
