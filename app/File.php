<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'name',
        'identifier',
        'disk',
        'path'
    ];

    protected $hidden = [
        'id',
        'disk'
    ];
}
