<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use Illuminate\Support\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin and client users
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@studio.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Test Client',
            'email' => 'client@example.com',
            'role' => 'client',
        ]);

        // Create sample photography services
        Service::create([
            'id' => Str::uuid(),
            'name' => 'Headshot Photography',
            'description' => 'Professional headshots perfect for LinkedIn, portfolios, and business profiles. Includes 1 hour session with professional lighting setup.',
            'category' => 'Professional',
            'price' => 150.00,
            'duration' => 60,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Portrait Session',
            'description' => 'Beautiful portrait photography session with natural lighting. Perfect for personal branding and family portraits. Includes 2 hours of shooting.',
            'category' => 'Portrait',
            'price' => 250.00,
            'duration' => 120,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Wedding Photography',
            'description' => 'Complete wedding day coverage with professional equipment and experienced photographer. Includes full ceremony and reception (8 hours).',
            'category' => 'Wedding',
            'price' => 2500.00,
            'duration' => 480,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Event Coverage',
            'description' => 'Professional photography for corporate events, conferences, and special occasions. Captures candid moments and key highlights throughout your event.',
            'category' => 'Event',
            'price' => 800.00,
            'duration' => 300,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Product Photography',
            'description' => 'High-quality product photography for e-commerce, catalogs, and marketing materials. Perfect for showcasing your products professionally.',
            'category' => 'Commercial',
            'price' => 350.00,
            'duration' => 180,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Family Portrait Session',
            'description' => 'Cherish family moments with professional family portraits. Includes outdoor or studio session with multiple outfit changes (1.5 hours).',
            'category' => 'Family',
            'price' => 300.00,
            'duration' => 90,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Maternity Photography',
            'description' => 'Beautiful maternity portraits capturing the beauty of pregnancy. Includes customized styling and location of choice (1 hour session).',
            'category' => 'Special',
            'price' => 200.00,
            'duration' => 60,
        ]);

        Service::create([
            'id' => Str::uuid(),
            'name' => 'Real Estate Photography',
            'description' => 'Professional property photography for real estate listings. Includes interior and exterior shots with professional editing and enhancement.',
            'category' => 'Commercial',
            'price' => 400.00,
            'duration' => 120,
        ]);
    }
}

