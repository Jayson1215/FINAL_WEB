<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class SupabaseService
{
    /**
     * Test the database connection to Supabase
     * 
     * @return bool
     */
    public static function testConnection()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            \Log::error('Supabase connection failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get the connection status message
     * 
     * @return string
     */
    public static function getConnectionStatus()
    {
        try {
            DB::connection()->getPdo();
            return 'Connected to Supabase successfully!';
        } catch (\Exception $e) {
            return 'Connection failed: ' . $e->getMessage();
        }
    }

    /**
     * Get database info
     * 
     * @return array
     */
    public static function getDatabaseInfo()
    {
        try {
            $version = DB::select('SELECT version()');
            $tables = DB::select("
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            ");

            return [
                'status' => 'connected',
                'version' => $version[0]->version ?? 'Unknown',
                'tables' => array_map(fn($table) => $table->table_name, $tables),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check if all required tables exist
     * 
     * @return array
     */
    public static function checkRequiredTables()
    {
        $requiredTables = [
            'users',
            'services',
            'portfolios',
            'bookings',
            'payments',
            'add_ons',
            'booking_addons',
        ];

        try {
            $existingTables = DB::select("
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            ");

            $existingTableNames = array_map(fn($table) => $table->table_name, $existingTables);

            $results = [];
            foreach ($requiredTables as $table) {
                $results[$table] = in_array($table, $existingTableNames) ? 
                    '✅ Exists' : '❌ Missing';
            }

            return $results;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
