<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function chapter() {
        return $this->belongsTo(Chapter::class);
    }

    public function lesson() {
        return $this->belongsTo(Lesson::class);
    }
}
