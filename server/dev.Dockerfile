# Note: alpine v12 is important here
# For some reason in v13.8 they decreased the call stack size or something 
# which causes the getFingerprintBuffer method to exceed the call stack size
# on trivially small fingerprints
FROM node:12-alpine 

WORKDIR /app
COPY ./package*.json ./

RUN npm install
COPY . .

CMD ["npm", "run", "start:dev"]