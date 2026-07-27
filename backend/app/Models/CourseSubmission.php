<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSubmission extends Model
{
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_REVIEWED = 'reviewed';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REVISION = 'revision';

    protected $fillable = [
        'user_id',
        'course_id',
        'project_title',
        'description',
        'repository_url',
        'demo_url',
        'status',
        'score',
        'feedback',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function reviewer() {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
