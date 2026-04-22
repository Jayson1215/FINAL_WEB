<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'service_id',
        'booking_date',
        'booking_time',
        'status',
        'refund_status',
        'cancellation_reason',
        'total_amount',
        'downpayment_amount',
        'paid_amount',
        'special_requests',
        'location',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'booking_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function addOns()
    {
        return $this->belongsToMany(AddOn::class, 'booking_addons', 'booking_id', 'add_on_id');
    }
}
