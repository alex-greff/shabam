FROM node:alpine

WORKDIR /app

# Copy the app over
COPY . .

# Installs the dependencies, builds the native addons and removes all the native libraries afterwards
# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
   python make g++ && \
   npm install --production && \
   npm run gyp:build && \
   apk del build-dependencies

CMD ["npm", "run", "start:prod"]