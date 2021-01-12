FROM node:12-alpine

WORKDIR /app
COPY ./package*.json ./

RUN npm install --production
COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]