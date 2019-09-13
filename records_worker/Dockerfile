FROM node:alpine

WORKDIR /app
COPY ./package*.json ./

RUN npm install --production
COPY . .

CMD ["npm", "run", "start:prod"]