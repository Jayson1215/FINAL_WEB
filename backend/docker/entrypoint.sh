#!/bin/sh

# Ensure storage directories exist and are writable
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Clear all caches
echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
echo "Running migrations..."
php artisan migrate --force 2>&1 | tee -a storage/logs/migration.log

# Seed database
echo "Seeding database..."
php artisan db:seed --force 2>&1 | tee -a storage/logs/seeding.log || echo "WARNING: Seeding failed or had issues"

# Verify data was seeded
echo "Verifying seeded data..."
php artisan tinker --execute="echo 'Services: ' . \App\Models\Service::count() . ', Portfolios: ' . \App\Models\Portfolio::count();" 2>&1 | tee -a storage/logs/verify.log

# Optimize app
echo "Optimizing app..."
php artisan config:cache

# Execute the CMD
exec "$@"
