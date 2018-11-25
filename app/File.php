<?php

namespace App;

use Storage;
use DateTime;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'name',
        'identifier',
        'disk',
        'path',
        'auth_key'
    ];

    public static function findByIdentifierOrFail(string $identifier)
    {
        return static::where('identifier', '=', $identifier)->firstOrFail();
    }

    public function hasExpired(): bool
    {
        // Check if the file was created more than 48 hours ago
    }

    public function getTemporaryUrl(DateTime $expiry)
    {
        return Storage::disk($this->disk)
            ->temporaryUrl(
                $this->path, $expiry 
            );
    }
}
