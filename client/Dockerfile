FROM node

RUN npm install -g serve

WORKDIR /client

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

CMD [ "serve", "-s", "dist", "-l", "80"]