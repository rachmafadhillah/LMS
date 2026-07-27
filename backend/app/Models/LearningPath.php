<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningPath extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'career_goal',
        'estimated_hours',
        'sort_order',
        'status',
    ];

    public function courses() {
        return $this->belongsToMany(Course::class, 'learning_path_courses')
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderBy('learning_path_courses.sort_order');
    }
}
