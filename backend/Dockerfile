FROM dunglas/frankenphp:1-php8.2-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev \
    mysql-client \
    icu-dev \
    oniguruma-dev \
    curl

# Install PHP extensions
RUN install-php-extensions \
    pdo_mysql \
    pdo_pgsql \
    gd \
    intl \
    zip \
    opcache \
    bcmath

# Set working directory
WORKDIR /app

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy application files
COPY . .

# Set permissions and prepare folders
RUN mkdir -p storage bootstrap/cache storage/logs \
    && chmod -R 777 storage bootstrap/cache storage/logs

# Install composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader

# Run artisan package discovery
RUN php artisan package:discover --ansi

# Set environment defaults
ENV APP_ENV=production
ENV APP_DEBUG=false

# Expose port (Render uses PORT env variable, but we expose 8000 as default)
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start PHP built-in server or FrankenPHP
CMD ["frankenphp", "run", "--bind=0.0.0.0:8000"]

# Use a custom entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
