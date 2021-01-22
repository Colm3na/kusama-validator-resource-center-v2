FROM node:erbium

WORKDIR /usr/app/crawler

COPY . /usr/app/crawler

RUN npm install --global yarn

RUN yarn 

CMD ["yarn", "start"]
