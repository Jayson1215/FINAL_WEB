<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Skip for SQLite and MySQL - they don't support ENUM ALTER TYPE like PostgreSQL
        $driver = DB::getDriverName();
        if ($driver === 'sqlite' || $driver === 'mysql') {
            return;
        }

        // For PostgreSQL, we need to handle enum differently
        DB::statement("ALTER TYPE payment_method RENAME TO payment_method_old");
        
        DB::statement("CREATE TYPE payment_method AS ENUM ('card', 'gcash', 'cash')");
        
        DB::statement("ALTER TABLE payments ALTER COLUMN payment_method TYPE payment_method USING payment_method::text::payment_method");
        
        DB::statement("DROP TYPE payment_method_old");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip for SQLite and MySQL - they don't support ENUM ALTER TYPE like PostgreSQL
        $driver = DB::getDriverName();
        if ($driver === 'sqlite' || $driver === 'mysql') {
            return;
        }

        // Revert to old payment methods
        DB::statement("ALTER TYPE payment_method RENAME TO payment_method_new");
        
        DB::statement("CREATE TYPE payment_method AS ENUM ('online', 'in-person')");
        
        DB::statement("ALTER TABLE payments ALTER COLUMN payment_method TYPE payment_method USING payment_method::text::payment_method");
        
        DB::statement("DROP TYPE payment_method_new");
    }
};
