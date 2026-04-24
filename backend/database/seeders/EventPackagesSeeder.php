<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\AddOn;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventPackagesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing services and add-ons
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Service::truncate();
        AddOn::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // --- WEDDING PACKAGES ---
        Service::create([
            'name' => 'Basic Wedding Package',
            'description' => 'Essential coverage for your special day. Perfect for intimate ceremonies.',
            'inclusions' => "• 1 videographer + 1 photographer\n• 4–6 hours coverage\n• Ceremony + selected highlights\n• 1–2 minute highlights video\n• 50–100 edited photos\n• Raw files included",
            'category' => 'Wedding',
            'price' => 8000,
            'duration' => 360, // 6 hours
            'downpayment_rate' => 20,
            'image_path' => 'wedding_package.png',
        ]);

        Service::create([
            'name' => 'Standard Wedding Package',
            'description' => 'Comprehensive coverage including full ceremony and partial reception.',
            'inclusions' => "• 2 videographers + 1 photographer\n• Full ceremony + partial reception coverage\n• 3–5 minute cinematic highlights\n• Full wedding video (ceremony + speeches)\n• 150–300 edited photos\n• Drone shots (if location allows)\n• Same-day teaser (optional)",
            'category' => 'Wedding',
            'price' => 20000,
            'duration' => 480, // 8 hours
            'downpayment_rate' => 20,
            'image_path' => 'wedding_package.png',
        ]);

        Service::create([
            'name' => 'Premium Wedding Package',
            'description' => 'The ultimate cinematic experience. Full-day coverage with a complete production team.',
            'inclusions' => "• Full production team (director + 2–3 shooters)\n• Full-day coverage (prep to reception)\n• Cinematic wedding film (5–10 minutes)\n• Full documentation video\n• 300–500 edited photos\n• Drone + creative shots\n• Pre-wedding/prenup shoot included\n• Same-day edit (SDE)\n• Photo album + USB",
            'category' => 'Wedding',
            'price' => 50000,
            'duration' => 720, // 12 hours
            'downpayment_rate' => 20,
            'image_path' => 'wedding_package.png',
        ]);

        // --- BIRTHDAY PACKAGES ---
        Service::create([
            'name' => 'Basic Birthday Package',
            'description' => 'Capture the highlights of your celebration.',
            'inclusions' => "• 1 photographer\n• 3–4 hours coverage\n• 50 edited photos\n• Simple photo editing",
            'category' => 'Birthday',
            'price' => 5000,
            'duration' => 240, // 4 hours
            'downpayment_rate' => 20,
            'image_path' => 'birthday_package.png',
        ]);

        Service::create([
            'name' => 'Standard Birthday Package',
            'description' => 'Photo and video coverage for your birthday event.',
            'inclusions' => "• 1 photographer + 1 videographer\n• 4–6 hours coverage\n• 100–150 edited photos\n• 2–3 minute highlights video\n• Basic lighting setup",
            'category' => 'Birthday',
            'price' => 12000,
            'duration' => 360, // 6 hours
            'downpayment_rate' => 20,
            'image_path' => 'birthday_package.png',
        ]);

        Service::create([
            'name' => 'Premium Birthday Package',
            'description' => 'Full event coverage with cinematic highlights and same-day slideshow.',
            'inclusions' => "• Full coverage (prep + party)\n• 2 photographers + 1 videographer\n• 200–300 edited photos\n• 3–5 minute cinematic video\n• Same-day slideshow\n• Photo booth setup (optional)",
            'category' => 'Birthday',
            'price' => 25000,
            'duration' => 480, // 8 hours
            'downpayment_rate' => 20,
            'image_path' => 'birthday_package.png',
        ]);

        // --- CHRISTENING PACKAGES ---
        Service::create([
            'name' => 'Basic Christening Package',
            'description' => 'Simple and meaningful coverage of the church ceremony.',
            'inclusions' => "• 1 photographer\n• Church ceremony coverage\n• 40–80 edited photos",
            'category' => 'Christening',
            'price' => 4000,
            'duration' => 120, // 2 hours
            'downpayment_rate' => 20,
            'image_path' => 'christening_package.png',
        ]);

        Service::create([
            'name' => 'Standard Christening Package',
            'description' => 'Coverage for both ceremony and reception.',
            'inclusions' => "• 1 photographer + 1 videographer\n• Ceremony + small reception\n• 80–150 edited photos\n• 2–3 minute highlights video",
            'category' => 'Christening',
            'price' => 10000,
            'duration' => 240, // 4 hours
            'downpayment_rate' => 20,
            'image_path' => 'christening_package.png',
        ]);

        Service::create([
            'name' => 'Premium Christening Package',
            'description' => 'Complete coverage with cinematic highlights and family portrait session.',
            'inclusions' => "• Full coverage (church + reception)\n• 2 shooters\n• 150–250 edited photos\n• Cinematic highlights video\n• Family portraits session\n• Photo album included",
            'category' => 'Christening',
            'price' => 18000,
            'duration' => 360, // 6 hours
            'downpayment_rate' => 20,
            'image_path' => 'christening_package.png',
        ]);

        // --- ORIGINAL STUDIO SERVICES ---
        Service::create([
            'name' => 'Editorial Portraiture',
            'description' => 'Sophisticated, studio-lit portraits designed for personal branding or high-fashion portfolios.',
            'inclusions' => "• 2 Hours studio session\n• 15 Edited high-end photos\n• 2 Outfit changes\n• Professional lighting setup\n• Directing & posing guidance",
            'category' => 'Portrait',
            'price' => 8500,
            'duration' => 120,
            'downpayment_rate' => 20,
            'image_path' => 'service_portrait.png',
        ]);

        Service::create([
            'name' => 'Fashion & Commercial',
            'description' => 'High-impact imagery for brands and designers. We create architectural and avant-garde compositions.',
            'inclusions' => "• 3 Hours coverage\n• 30 Edited commercial photos\n• Creative art direction\n• High-resolution files for print\n• Full usage rights included",
            'category' => 'Commercial',
            'price' => 25000,
            'duration' => 180,
            'downpayment_rate' => 20,
            'image_path' => 'service_editorial.png',
        ]);

        Service::create([
            'name' => 'Gala & Event Coverage',
            'description' => 'Discreet and candid coverage of premium celebrations. We capture the atmosphere, the guests, and the sophisticated details.',
            'inclusions' => "• 4 Hours coverage\n• Unlimited raw photos\n• 100 Edited highlights\n• Same-day social teaser\n• Online gallery delivery",
            'category' => 'General Event',
            'price' => 15000,
            'duration' => 240,
            'downpayment_rate' => 20,
            'image_path' => 'service_event.png',
        ]);

        // --- ADD-ONS ---
        AddOn::create(['name' => 'Drone Coverage', 'price' => 3000]);
        AddOn::create(['name' => 'Same-Day Edit (SDE)', 'price' => 5000]);
        AddOn::create(['name' => 'Photo Booth', 'price' => 4000]);
        AddOn::create(['name' => 'Extra Hours (per hour)', 'price' => 1000]);
        AddOn::create(['name' => 'Express Editing (24–48 hrs)', 'price' => 2000]);
        AddOn::create(['name' => 'Printed Albums / Photobooks', 'price' => 3500]);
        AddOn::create(['name' => 'Social Media Reels (TikTok/IG)', 'price' => 1500]);
    }
}
