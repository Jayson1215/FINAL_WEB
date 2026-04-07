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
        // Create default admin account
        User::updateOrCreate(
            ['email' => 'Admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Test Client',
                'role' => 'client',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            StudioContentSeeder::class,
        ]);
    }
}

