<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Service;
use App\Models\AddOn;

class UpdatePrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'prices:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates prices from 20 to realistic numbers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updates = ['Basic Wedding Package' => 35000, 'Standard Wedding Package' => 55000, 'Premium Wedding Package' => 85000, 'Basic Birthday Package' => 8000, 'Standard Birthday Package' => 15000, 'Premium Birthday Package' => 25000, 'Basic Christening Package' => 5000, 'Standard Christening Package' => 10000, 'Premium Christening Package' => 18000, 'Editorial Portraiture' => 12000, 'Fashion & Commercial' => 25000, 'Gala & Event Coverage' => 30000];
        foreach ($updates as $name => $price) {
            Service::where('name', $name)->update(['price' => $price]);
        }
        
        $addon_updates = ['Drone Coverage' => 5000, 'Same-Day Edit (SDE)' => 15000, 'Photo Booth' => 6000, 'Extra Hours (per hour)' => 1500, 'Express Editing (24–48 hrs)' => 3000, 'Printed Albums / Photobooks' => 4000, 'Social Media Reels (TikTok/IG)' => 2500];
        foreach ($addon_updates as $name => $price) {
            AddOn::where('name', $name)->update(['price' => $price]);
        }
        
        $this->info('Prices updated successfully!');
    }
}
