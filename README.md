# Shabam
A replica of the popular music-recognition app, Shazam.

## Table of Contents
* [Table of Contents](#table-of-contents)
* [Npm Scripts](#npm-scripts)

## Npm Scripts
A list of all the base npm commands available. When running prefix all the following commands with `npm run`

### Environments
* `dev`: the full development environment

### Containers
* `proxy`: the reverse-proxy container running on Nginx
* `client`: the Vue frontend container
* `api`: the Node JS backend container
* `fingerprint-worker`: the fingerprint worker container
* `identification-worker`: the track identification worker container
* `records-worker`: the track records search worker

### Commands

* `test`: Tests the application (NOTE: not implemented yet)
* `start:[environment]`: Starts up the given environement
* `start:[environment]--recreate-[?container]`: Removes the given container(s) and then starts the given environment
  * This is mainly used to reinstall the `node_modules` of a container which is necessary when adding new packages. 
* `rm-services:[environment]-[?container]`: Removes the given services. If no specific service is specified then all are removed.
* `restart:[environment]-[?container]`: Restarts the given containers. If no specific container is specified then the entire environment is restarted.
* `shell:[container]`: Opens an interactive shell into the given container.
