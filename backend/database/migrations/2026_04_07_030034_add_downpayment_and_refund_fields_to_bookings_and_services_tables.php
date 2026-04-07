<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->decimal('downpayment_rate', 5, 2)->default(20.00)->after('price');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('downpayment_amount', 10, 2)->default(0.00)->after('total_amount');
            $table->decimal('paid_amount', 10, 2)->default(0.00)->after('downpayment_amount');
            $table->enum('refund_status', ['none', 'requested', 'refunded'])->default('none')->after('status');
            $table->text('cancellation_reason')->nullable()->after('refund_status');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->enum('type', ['downpayment', 'balance', 'full'])->default('full')->after('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('downpayment_rate');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['downpayment_amount', 'paid_amount', 'refund_status', 'cancellation_reason']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
