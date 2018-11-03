<?php

namespace App\Http\Controllers;

use App\File;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    protected $disk = 's3';

    public function upload(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:1000',
            'file' => 'required|file|max:614400'
        ]);

        return File::create([
            'name' => $data['name'],
            'identifier' => (string) Str::uuid(),
            'disk' => $this->disk,
            'path' => $request->file('file')->store(null, $this->disk)
        ]);
    }
}
