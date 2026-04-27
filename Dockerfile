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

# Copy MySQL SSL certificate to root for easier access
RUN cp -f /app/backend/storage/ca.pem /app/ca.pem 2>/dev/null || echo "Note: ca.pem not found, SSL may not work"

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
RUN mkdir -p /app/backend/public/assets/images \
 && if [ -d /app/frontend/public/images ]; then cp -f /app/frontend/public/images/* /app/backend/public/assets/images/ 2>/dev/null || true; fi
RUN chown -R www-data:www-data storage bootstrap/cache

WORKDIR /app/backend

EXPOSE 8000

# Copy Nginx config (we'll create this next)
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Start Nginx and PHP-FPM
# Start PHP-FPM in background, update Nginx port, and start Nginx
# Setup and Start
CMD php artisan config:clear; php artisan route:clear; php artisan migrate --force; php artisan db:seed --force; php-fpm -D; sed -i "s/listen 8000;/listen ${PORT:-8000};/g" /etc/nginx/http.d/default.conf; nginx -g 'daemon off;'
