<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatrolPoint extends Model
{
    protected $fillable = [
        'code',
        'name',
        'area',
        'latitude',
        'longitude',
        'allowed_radius_meters',
        'schedule_time_start',
        'schedule_time_end',
        'instructions',
        'image_sample_url',
    ];

    public function logs()
    {
        return $this->hasMany(PatrolLog::class);
    }
}
