<?php

namespace App\Console\Commands;

use App\Services\SupabaseService;
use Illuminate\Console\Command;

class TestSupabaseConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'supabase:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test connection to Supabase PostgreSQL database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Testing Supabase Connection...\n');

        // Test connection
        if (SupabaseService::testConnection()) {
            $this->info('✅ Database Connection: SUCCESS\n');
        } else {
            $this->error('❌ Database Connection: FAILED\n');
            $this->error('Please check your .env file:');
            $this->error('  - DB_HOST');
            $this->error('  - DB_PORT');
            $this->error('  - DB_DATABASE');
            $this->error('  - DB_USERNAME');
            $this->error('  - DB_PASSWORD\n');
            return 1;
        }

        // Get database info
        $this->info('📊 Database Information:');
        $info = SupabaseService::getDatabaseInfo();
        if ($info['status'] === 'connected') {
            $this->info('Version: ' . $info['version']);
            $this->info('Tables: ' . count($info['tables']) . ' found\n');
        }

        // Check required tables
        $this->info('🗂️  Required Tables Status:');
        $tableStatus = SupabaseService::checkRequiredTables();
        
        foreach ($tableStatus as $table => $status) {
            if (str_contains($status, '✅')) {
                $this->info("  $table: $status");
            } else {
                $this->warn("  $table: $status");
            }
        }

        $this->info('\n✨ Great! Your Supabase connection is ready.');
        $this->info('Run: php artisan migrate (if tables are missing)\n');

        return 0;
    }
}
