<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Lesson;

class CourseProgressService
{
    public function calculate($courseId, $userId): array
    {
        $totalLessonsCount = Lesson::whereHas('chapter', function ($query) use ($courseId) {
            $query->where('course_id', $courseId);
        })
            ->where('status', 1)
            ->whereNotNull('video')
            ->count();

        $completedLessonsCount = Activity::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('is_complete', 'yes')
            ->distinct('lesson_id')
            ->count('lesson_id');

        return [
            'percentage' => $totalLessonsCount > 0 ? round(($completedLessonsCount / $totalLessonsCount) * 100) : 0,
            'completed_lessons_count' => $completedLessonsCount,
            'total_lessons_count' => $totalLessonsCount,
        ];
    }
}
