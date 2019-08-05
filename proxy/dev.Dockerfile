FROM nginx
COPY ./default-dev.conf /etc/nginx/conf.d/default.conf
COPY ./mime.types /etc/nginx/mime.types