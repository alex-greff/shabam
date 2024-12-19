# Core-Lib

The core library for the track recognition algorithm.

## First Time Setup

On the host machine run `git submodule update --init --recursive` and an empty
directory called `node_modules`

## Dev Environment

The development environment is setup to be Dockerized and can be run with the
Remote Containers Extension. To do so
`CTRL + SHIFT + P > Dev Containers: Reopen in Container`

## Debugging

To debug go to the debug tab and select the profile you'd like to debug. Set
breakpoints before running.

To change the arguments that are run with the program go to `.vscode/launch.json`
and change the `args` array in the configuration you want.
