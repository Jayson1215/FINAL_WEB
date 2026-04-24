<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Service;
use App\Models\AddOn;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all services (packages) to 20 PHP
        Service::query()->update(['price' => 20.00]);
        
        // Update all add-ons to 20 PHP
        AddOn::query()->update(['price' => 20.00]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to reverse this without knowing old prices
    }
};
