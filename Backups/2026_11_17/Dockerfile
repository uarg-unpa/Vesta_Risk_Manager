# ----- Composer / PHP dependencies -----
FROM composer:2 AS composer

WORKDIR /app

COPY ./composer.json ./composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader

COPY ./index.php ./
COPY ./api ./api/
COPY ./config ./config/


FROM php:8.3.36-fpm-alpine

RUN apk add --no-cache nginx \
    && docker-php-ext-install pdo pdo_mysql mysqli

RUN mkdir -p /run/nginx

COPY --from=composer /app/ /var/www/html/api/
COPY frontend/ /var/www/html/

RUN mkdir -p /var/www/html/api/api/bloqueo \
    && chown www-data:www-data /var/www/html/api/api/bloqueo \
    && chmod 700 /var/www/html/api/api/bloqueo

COPY docker/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 8080

CMD php-fpm -F & exec nginx -g 'daemon off;'
