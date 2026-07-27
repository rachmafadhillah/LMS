<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseDiscussion extends Model
{
    protected $fillable = [
        'course_id',
        'user_id',
        'parent_id',
        'title',
        'body',
        'status',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function replies() {
        return $this->hasMany(CourseDiscussion::class, 'parent_id')
            ->with('user')
            ->oldest();
    }
}
