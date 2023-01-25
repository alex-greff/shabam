# Core-Lib

The core library for the song recognition algorithm.

## First Time Setup

On the host machine run `git submodule update --init --recursive` and an empty
directory called `node_modules`

Next run the dev container then within the container run `npm run gyp:build`

## Dev Environment

The development environment is setup to be Dockerized and can be run with the
Remote Containers Extension. To do so
`CTRL + SHIFT + P > Dev Containers: Reopen in Container`

## Building Dist

Within the container run `npm run build`, this will build the transpiled
JavaScript code in the `dist` folder.