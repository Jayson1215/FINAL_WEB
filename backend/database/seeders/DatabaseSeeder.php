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
        // Ensure admin exists
        $admin = User::withTrashed()->firstOrNew(['email' => 'admin@studio.com']);
        $admin->fill([
            'name' => 'Studio Admin',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin',
        ]);
        if ($admin->trashed()) $admin->restore();
        $admin->save();

        // Ensure test client exists
        $client = User::withTrashed()->firstOrNew(['email' => 'client@example.com']);
        $client->fill([
            'name' => 'Test Client',
            'role' => 'client',
            'password' => bcrypt('password'),
        ]);
        if ($client->trashed()) $client->restore();
        $client->save();

        $this->call([
            StudioContentSeeder::class,
            EventPackagesSeeder::class,
            ImageAssetsSeeder::class,
        ]);
    }
}

