FROM php:8.3-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

WORKDIR /app

# Copy project files
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN composer install --no-dev --optimize-autoloader

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy built frontend to public
RUN cp -r dist/* /app/backend/public/

WORKDIR /app/backend

# Generate APP_KEY if not set
RUN php artisan key:generate --force || true

# Run migrations
RUN php artisan migrate --force --no-interaction || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
