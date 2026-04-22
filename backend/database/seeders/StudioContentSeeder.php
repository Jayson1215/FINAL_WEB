<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudioContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n=== Starting StudioContentSeeder ===\n";
        
        // Disable foreign key checks for multiple DB types (SQLite or MySQL)
        try {
            if (config('database.default') === 'sqlite') {
                \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = OFF;');
            } else {
                \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            }
            echo "Foreign key checks disabled\n";
        } catch (\Exception $e) {
            echo "Warning: Could not disable foreign keys: {$e->getMessage()}\n";
        }
        
        // Truncate tables safely
        try {
            \App\Models\Booking::truncate();
            echo "Bookings table truncated\n";
        } catch (\Exception $e) {
            echo "Warning: Could not truncate bookings: {$e->getMessage()}\n";
        }
        
        try {
            \App\Models\Service::truncate();
            echo "Services table truncated\n";
        } catch (\Exception $e) {
            echo "Warning: Could not truncate services: {$e->getMessage()}\n";
        }
        
        try {
            \App\Models\Portfolio::truncate();
            echo "Portfolio table truncated\n";
        } catch (\Exception $e) {
            echo "Warning: Could not truncate portfolio: {$e->getMessage()}\n";
        }

        // Re-enable foreign key checks
        try {
            if (config('database.default') === 'sqlite') {
                \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = ON;');
            } else {
                \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            }
            echo "Foreign key checks re-enabled\n";
        } catch (\Exception $e) {
            echo "Warning: Could not re-enable foreign keys: {$e->getMessage()}\n";
        }

        // --- SEED SERVICES ---
        echo "\nSeeding Services...\n";
        $apiUrl = config('app.url');
        $services = [
            [
                'name' => 'The Signature Wedding',
                'description' => 'A comprehensive visual narrative of your union. Capture every delicate moment, from the morning preparation to the final dance, with an editorial eye.',
                'category' => 'Wedding',
                'price' => 45000.00,
                'duration' => 600, // 10 hours
                'image_path' => $apiUrl . '/api/images/service_wedding.png'
            ],
            [
                'name' => 'Editorial Portraiture',
                'description' => 'Sophisticated, studio-lit portraits designed for personal branding or high-fashion portfolios. Includes professional skin retouching and artistic direction.',
                'category' => 'Portrait',
                'price' => 8500.00,
                'duration' => 120, // 2 hours
                'image_path' => $apiUrl . '/api/images/service_portrait.png'
            ],
            [
                'name' => 'Fashion & Commercial',
                'description' => 'High-impact imagery for brands and designers. We create architectural and avant-garde compositions that define your vision.',
                'category' => 'Editorial',
                'price' => 25000.00,
                'duration' => 300, // 5 hours
                'image_path' => $apiUrl . '/api/images/service_editorial.png'
            ],
            [
                'name' => 'Gala & Event Coverage',
                'description' => 'Discreet and candid coverage of premium celebrations. We capture the atmosphere, the guests, and the sophisticated details of your event.',
                'category' => 'Events',
                'price' => 15000.00,
                'duration' => 240, // 4 hours
                'image_path' => $apiUrl . '/api/images/service_event.png'
            ],
        ];

        foreach ($services as $service) {
            try {
                \App\Models\Service::create($service);
                echo "✓ Created service: {$service['name']}\n";
            } catch (\Exception $e) {
                echo "✗ Error creating service {$service['name']}: {$e->getMessage()}\n";
            }
        }

        // --- SEED PORTFOLIO ---
        echo "\nSeeding Portfolio...\n";
        $portfolioItems = [
            [
                'title' => 'Ethereal Grace',
                'category' => 'Bridal',
                'image_url' => $apiUrl . '/api/images/portfolio_bride.png',
                'description' => 'A close-up study of bridal elegance, focusing on light and texture.'
            ],
            [
                'title' => 'The Noir Muse',
                'category' => 'Fashion',
                'image_url' => $apiUrl . '/api/images/portfolio_fashion.png',
                'description' => 'Minimalist fashion photography exploring shadows and architectural lines.'
            ],
            [
                'title' => 'First Light',
                'category' => 'Newborn',
                'image_url' => $apiUrl . '/api/images/portfolio_newborn.png',
                'description' => 'A tender, minimalist representation of new beginnings.'
            ],
            [
                'title' => 'The Metropolitan Gala',
                'category' => 'Events',
                'image_url' => $apiUrl . '/api/images/portfolio_corporate.png',
                'description' => 'Capturing the sophisticated ambiance of a high-end corporate gathering.'
            ],
            [
                'title' => 'Linear Serenity',
                'category' => 'Architecture',
                'image_url' => $apiUrl . '/api/images/portfolio_architecture.png',
                'description' => 'Exploring the intersection of natural light and modern design.'
            ],
            [
                'title' => 'The Silent Peak',
                'category' => 'Nature',
                'image_url' => $apiUrl . '/api/images/portfolio_nature.png',
                'description' => 'A dramatic, ethereal landscape study in atmospheric light.'
            ],
        ];

        foreach ($portfolioItems as $item) {
            try {
                \App\Models\Portfolio::create($item);
                echo "✓ Created portfolio: {$item['title']}\n";
            } catch (\Exception $e) {
                echo "✗ Error creating portfolio {$item['title']}: {$e->getMessage()}\n";
            }
        }
        
        echo "\n=== StudioContentSeeder Complete ===\n";
    }
}
