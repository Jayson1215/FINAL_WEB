FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    nodejs \
    npm \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    sqlite-dev \
    bash

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Build Frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Setup Backend
WORKDIR /app/backend
# Ensure Laravel required directories exist in container build context.
RUN mkdir -p bootstrap/cache \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    database \
 && touch database/database.sqlite \
 && chown -R www-data:www-data bootstrap/cache storage database \
 && chmod -R ug+rwX bootstrap/cache storage database
RUN composer install --no-dev --optimize-autoloader
# Copy built frontend to public
RUN mkdir -p public
RUN cp -r /app/frontend/dist/* /app/backend/public/
RUN chown -R www-data:www-data storage bootstrap/cache

WORKDIR /app/backend

EXPOSE 8000

# Copy Nginx config (we'll create this next)
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Start Nginx and PHP-FPM
CMD php-fpm83 && nginx -g 'daemon off;'
