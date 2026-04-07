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
        // Disable foreign key checks for multiple DB types (SQLite or MySQL)
        if (config('database.default') === 'sqlite') {
            \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = OFF;');
        } else {
            \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }
        
        \App\Models\Service::truncate();
        \App\Models\Portfolio::truncate();
        \App\Models\Booking::truncate();

        if (config('database.default') === 'sqlite') {
            \Illuminate\Support\Facades\DB::statement('PRAGMA foreign_keys = ON;');
        } else {
            \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // --- SEED SERVICES ---
        $services = [
            [
                'name' => 'The Signature Wedding',
                'description' => 'A comprehensive visual narrative of your union. Capture every delicate moment, from the morning preparation to the final dance, with an editorial eye.',
                'category' => 'Wedding',
                'price' => 45000.00,
                'duration' => 600, // 10 hours
                'image_path' => 'assets/images/service_wedding.png'
            ],
            [
                'name' => 'Editorial Portraiture',
                'description' => 'Sophisticated, studio-lit portraits designed for personal branding or high-fashion portfolios. Includes professional skin retouching and artistic direction.',
                'category' => 'Portrait',
                'price' => 8500.00,
                'duration' => 120, // 2 hours
                'image_path' => 'assets/images/service_portrait.png'
            ],
            [
                'name' => 'Fashion & Commercial',
                'description' => 'High-impact imagery for brands and designers. We create architectural and avant-garde compositions that define your vision.',
                'category' => 'Editorial',
                'price' => 25000.00,
                'duration' => 300, // 5 hours
                'image_path' => 'assets/images/service_editorial.png'
            ],
            [
                'name' => 'Gala & Event Coverage',
                'description' => 'Discreet and candid coverage of premium celebrations. We capture the atmosphere, the guests, and the sophisticated details of your event.',
                'category' => 'Events',
                'price' => 15000.00,
                'duration' => 240, // 4 hours
                'image_path' => 'assets/images/service_event.png'
            ],
        ];

        foreach ($services as $service) {
            \App\Models\Service::create($service);
        }

        // --- SEED PORTFOLIO ---
        $portfolioItems = [
            [
                'title' => 'Ethereal Grace',
                'category' => 'Bridal',
                'image_url' => 'assets/images/portfolio_bride.png',
                'description' => 'A close-up study of bridal elegance, focusing on light and texture.'
            ],
            [
                'title' => 'The Noir Muse',
                'category' => 'Fashion',
                'image_url' => 'assets/images/portfolio_fashion.png',
                'description' => 'Minimalist fashion photography exploring shadows and architectural lines.'
            ],
            [
                'title' => 'First Light',
                'category' => 'Newborn',
                'image_url' => 'assets/images/portfolio_newborn.png',
                'description' => 'A tender, minimalist representation of new beginnings.'
            ],
            [
                'title' => 'The Metropolitan Gala',
                'category' => 'Events',
                'image_url' => 'assets/images/portfolio_corporate.png',
                'description' => 'Capturing the sophisticated ambiance of a high-end corporate gathering.'
            ],
            [
                'title' => 'Linear Serenity',
                'category' => 'Architecture',
                'image_url' => 'assets/images/portfolio_architecture.png',
                'description' => 'Exploring the intersection of natural light and modern design.'
            ],
            [
                'title' => 'The Silent Peak',
                'category' => 'Nature',
                'image_url' => 'assets/images/portfolio_nature.png',
                'description' => 'A dramatic, ethereal landscape study in atmospheric light.'
            ],
        ];

        foreach ($portfolioItems as $item) {
            \App\Models\Portfolio::create($item);
        }
    }
}
