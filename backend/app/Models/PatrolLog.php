<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatrolLog extends Model
{
    protected $fillable = [
        'guard_id',
        'patrol_point_id',
        'scanned_at',
        'latitude',
        'longitude',
        'distance_meters',
        'photo_path',
        'status',
        'notes',
    ];

    public function guard()
    {
        return $this->belongsTo(User::class, 'guard_id');
    }

    public function point()
    {
        return $this->belongsTo(PatrolPoint::class, 'patrol_point_id');
    }
}
