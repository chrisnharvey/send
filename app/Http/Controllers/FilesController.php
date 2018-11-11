<?php

namespace App\Http\Controllers;

use App\File;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Resources\FileResource;
use App\Http\Resources\UnauthenticatedFileResource;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class FilesController extends Controller
{
    protected $disk = 's3';

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|max:1000',
            'file' => 'required|file|max:614400',
            'auth_key' => 'required|size:128'
        ]);

        return File::create([
            'name' => $data['name'],
            'identifier' => (string) Str::uuid(),
            'auth_key' => $data['auth_key'],
            'disk' => $this->disk,
            'path' => $request->file('file')->store(null, $this->disk)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $identifier
     * @return \Illuminate\Http\Response
     */
    public function show(string $identifier, Request $request)
    {
        $file = File::findByIdentifierOrFail($identifier);

        if ($authKey = $request->get('auth_key')) {
            return $this->verifyAuthKey($file, $authKey);
        }

        return new UnauthenticatedFileResource($file);
    }

    protected function verifyAuthKey(File $file, $authKey)
    {
        if ($file->auth_key == $authKey) {
            return new FileResource($file);
        }

        throw new AccessDeniedHttpException('Invalid auth key');
    }
}