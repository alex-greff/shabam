FROM node:alpine

WORKDIR /app

COPY ./package.json ./

# Install the needed dependencies 
RUN apk --no-cache --virtual build-dependencies add \
   python make g++

# Install npm dependencies
RUN npm install

# Copy the rest of the app over
COPY . .

CMD ["npm", "run", "start:dev"]