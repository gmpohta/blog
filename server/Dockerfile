FROM node

WORKDIR /server

COPY package*.json .

RUN npm install

COPY . .

VOLUME [ "/media" ]

EXPOSE ${PORT}

CMD ["npm", "run", "start"]