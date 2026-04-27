#!/bin/sh

set -e

echo "========================================="
echo "Starting Laravel Application"
echo "========================================="

# Ensure storage directories exist and are writable
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache bootstrap/cache storage/logs
chmod -R 777 storage bootstrap/cache storage/logs
chmod -R a+rwx storage bootstrap/cache storage/logs 2>/dev/null || true

# Ensure external image storage directory exists when configured (e.g. Render disk)
if [ -n "$IMAGES_STORAGE_PATH" ]; then
    mkdir -p "$IMAGES_STORAGE_PATH"
    chmod -R 777 "$IMAGES_STORAGE_PATH" 2>/dev/null || true
fi

# Clear all caches
echo "[1/6] Clearing caches..."
php artisan cache:clear --no-interaction || true
php artisan config:clear --no-interaction || true
php artisan route:clear --no-interaction || true
php artisan view:clear --no-interaction || true

# Check database connection
echo "[2/6] Checking database connection..."
php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection OK\n';" || {
    echo "ERROR: Cannot connect to database. Waiting and retrying..."
    sleep 5
    php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connection OK after retry\n';"
}

# Run migrations
echo "[3/6] Running migrations..."
php artisan migrate --force --no-interaction 2>&1 | tee -a storage/logs/startup.log || {
    echo "WARNING: Migration had issues but continuing..."
}

# Seed database only if tables are empty
echo "[4/6] Seeding database (if needed)..."
php artisan tinker --execute="
    if (\App\Models\Service::count() == 0) {
        echo 'Seeding database...\n';
        Artisan::call('db:seed', ['--force' => true]);
        echo 'Seeding complete\n';
    } else {
        echo 'Database already has data, skipping seed\n';
    }
" 2>&1 | tee -a storage/logs/startup.log || {
    echo "WARNING: Seeding had issues but continuing..."
}

# Verify data
echo "[5/6] Verifying seeded data..."
php artisan tinker --execute="
    \$services = \App\Models\Service::count();
    \$portfolios = \App\Models\Portfolio::count();
    echo \"Services: \$services, Portfolios: \$portfolios\n\";
" || echo "WARNING: Could not verify data"

# Optimize app
echo "[6/6] Optimizing application..."
php artisan config:cache --no-interaction || true
php artisan route:cache --no-interaction || true

echo "========================================="
echo "✓ Application startup complete!"
echo "========================================="

# Execute the main application process
exec "$@"
