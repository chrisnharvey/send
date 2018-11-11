<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'identifier' => $this->identifier,
            'name' => $this->name,
            'has_password' => (bool) $this->has_password,
            'path' => $this->getTemporaryUrl(now()->addMinutes(5))
        ];
    }
}
