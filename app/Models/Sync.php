<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sync extends Model
{
    use HasFactory;

    protected $appends = ['audius_url', 'synced_at'];
    protected $casts = [
        'automated' => 'boolean',
    ];
    protected $guarded = [];

    public function getAudiusUrlAttribute()
    {
        $audius_host = config('app.audius_url');
        return "{$audius_host}{$this->attributes['audius_url']}";
    }

    public function getSyncedAtAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }

    public function podcast()
    {
        return $this->belongsTo(Podcast::class);
    }
}
