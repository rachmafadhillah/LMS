<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $paths = [
            [
                'title' => 'Backend Developer Laravel',
                'slug' => 'backend-developer-laravel',
                'description' => 'Jalur belajar dari dasar Laravel API sampai LMS siap portofolio.',
                'career_goal' => 'Backend Developer',
                'estimated_hours' => 42,
                'keywords' => ['Laravel', 'Database'],
            ],
            [
                'title' => 'Frontend Developer React',
                'slug' => 'frontend-developer-react',
                'description' => 'Jalur belajar React untuk membuat UI modern, responsif, dan terhubung API.',
                'career_goal' => 'Frontend Developer',
                'estimated_hours' => 38,
                'keywords' => ['React', 'UI/UX'],
            ],
            [
                'title' => 'Fullstack Web Developer',
                'slug' => 'fullstack-web-developer',
                'description' => 'Gabungan backend, frontend, UI/UX, dan praktik project nyata seperti platform pembelajaran.',
                'career_goal' => 'Fullstack Developer',
                'estimated_hours' => 72,
                'keywords' => ['Laravel', 'React', 'UI/UX', 'Database'],
            ],
        ];

        foreach ($paths as $pathIndex => $path) {
            DB::table('learning_paths')->updateOrInsert(
                ['slug' => $path['slug']],
                [
                    'title' => $path['title'],
                    'description' => $path['description'],
                    'career_goal' => $path['career_goal'],
                    'estimated_hours' => $path['estimated_hours'],
                    'sort_order' => $pathIndex + 1,
                    'status' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $learningPathId = DB::table('learning_paths')->where('slug', $path['slug'])->value('id');
            $courseIds = DB::table('courses')
                ->where(function ($query) use ($path) {
                    foreach ($path['keywords'] as $keyword) {
                        $query->orWhere('title', 'like', '%' . $keyword . '%');
                    }
                })
                ->orderBy('id')
                ->limit(4)
                ->pluck('id');

            foreach ($courseIds as $courseOrder => $courseId) {
                DB::table('learning_path_courses')->updateOrInsert(
                    [
                        'learning_path_id' => $learningPathId,
                        'course_id' => $courseId,
                    ],
                    [
                        'sort_order' => $courseOrder + 1,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }

    public function down(): void
    {
        $slugs = ['backend-developer-laravel', 'frontend-developer-react', 'fullstack-web-developer'];
        $pathIds = DB::table('learning_paths')->whereIn('slug', $slugs)->pluck('id');

        DB::table('learning_path_courses')->whereIn('learning_path_id', $pathIds)->delete();
        DB::table('learning_paths')->whereIn('id', $pathIds)->delete();
    }
};
