FROM node:alpine

WORKDIR /app
COPY ./package.json ./

COPY . .

# Installs the native dependencies, builds the native addons and removes all the dependencies afterwards
# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
   python make g++ && \
   npm install && \
   npm run gyp:build && \
   apk del build-dependencies

CMD ["npm", "run", "start:dev"]