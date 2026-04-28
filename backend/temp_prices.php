<?php
$updates = ['Basic Wedding Package' => 35000, 'Standard Wedding Package' => 55000, 'Premium Wedding Package' => 85000, 'Basic Birthday Package' => 8000, 'Standard Birthday Package' => 15000, 'Premium Birthday Package' => 25000, 'Basic Christening Package' => 5000, 'Standard Christening Package' => 10000, 'Premium Christening Package' => 18000, 'Editorial Portraiture' => 12000, 'Fashion & Commercial' => 25000, 'Gala & Event Coverage' => 30000];
foreach ($updates as $name => $price) {
    \App\Models\Service::where('name', $name)->update(['price' => $price]);
}

$addon_updates = ['Drone Coverage' => 5000, 'Same-Day Edit (SDE)' => 15000, 'Photo Booth' => 6000, 'Extra Hours (per hour)' => 1500, 'Express Editing (24–48 hrs)' => 3000, 'Printed Albums / Photobooks' => 4000, 'Social Media Reels (TikTok/IG)' => 2500];
foreach ($addon_updates as $name => $price) {
    \App\Models\AddOn::where('name', $name)->update(['price' => $price]);
}
echo "Prices Updated!\n";
