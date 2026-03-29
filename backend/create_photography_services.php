<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\Service;

$photographyServices = [
    [
        'name' => 'Portrait Photography',
        'description' => 'Professional portrait session with high-quality lighting and backdrops. Includes 1 hour session and digital copies of all edited photos.',
        'category' => 'photography',
        'price' => 150.00,
        'duration' => 60,
    ],
    [
        'name' => 'Wedding Photography',
        'description' => 'Complete wedding day coverage with candid and posed shots. Includes 8 hours coverage, second photographer, and edited digital gallery.',
        'category' => 'photography',
        'price' => 1500.00,
        'duration' => 480,
    ],
    [
        'name' => 'Family Session',
        'description' => 'Outdoor or studio family photo session. Perfect for updated family portraits and holiday cards. Includes 45 minutes session and 20-30 edited photos.',
        'category' => 'photography',
        'price' => 250.00,
        'duration' => 45,
    ],
    [
        'name' => 'Headshot Photography',
        'description' => 'Professional headshots for LinkedIn, acting, and corporate profiles. Includes 30 minutes session and 5 retouched digital images.',
        'category' => 'photography',
        'price' => 100.00,
        'duration' => 30,
    ],
    [
        'name' => 'Product Photography',
        'description' => 'High-quality product images for e-commerce, catalogs, and advertising. Professional lighting and styling included.',
        'category' => 'photography',
        'price' => 300.00,
        'duration' => 90,
    ],
    [
        'name' => 'Event Photography',
        'description' => 'Coverage for corporate events, parties, conferences, and celebrations. Candid and group shots, professionally edited.',
        'category' => 'photography',
        'price' => 500.00,
        'duration' => 180,
    ],
    [
        'name' => 'Maternity Photography',
        'description' => 'Beautiful maternity portrait session. Includes 1 hour session in our studio with custom maternity props and 20+ edited photos.',
        'category' => 'photography',
        'price' => 250.00,
        'duration' => 60,
    ],
    [
        'name' => 'Newborn Photography',
        'description' => 'Gentle and safe newborn photo session. Includes 2-3 hours session with various poses and outfits, resulting in 50+ finished images.',
        'category' => 'photography',
        'price' => 400.00,
        'duration' => 150,
    ],
    [
        'name' => 'Real Estate Photography',
        'description' => 'Professional property photography with drone shots available. Includes exterior, interior, and detail shots for real estate listings.',
        'category' => 'photography',
        'price' => 350.00,
        'duration' => 120,
    ],
    [
        'name' => 'Couples Photography',
        'description' => 'Romantic couples session perfect for engagements, anniversaries, or just updating photos. Includes 1.5 hours session, location scouting, and 40+ edited images.',
        'category' => 'photography',
        'price' => 350.00,
        'duration' => 90,
    ],
];

echo "Adding 10 Photography Services...\n\n";

$created = 0;
foreach ($photographyServices as $service) {
    $existing = Service::where('name', $service['name'])->first();
    
    if ($existing) {
        echo "✓ Service already exists: {$service['name']}\n";
    } else {
        Service::create($service);
        echo "✓ Created: {$service['name']} - \${$service['price']}/\${$service['duration']} min\n";
        $created++;
    }
}

echo "\n✓ Total services created: {$created}/10\n";

// Show all services
$allServices = Service::all();
echo "\n✓ Total services in database: " . $allServices->count() . "\n";

echo "\nServices:\n";
foreach ($allServices as $service) {
    echo "  - {$service->name} - \${$service->price} ({$service->duration} min)\n";
}
