<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->clearTables();

        $now = now();
        $this->seedRolesAndPermissions($now);

        $categories = $this->seedLookup('categories', [
            'Web Development',
            'Data Science',
            'UI/UX Design',
            'Digital Marketing',
            'Business',
            'Mobile Development',
        ], $now);

        $levels = $this->seedLookup('levels', [
            'Beginner',
            'Intermediate',
            'Advanced',
        ], $now);

        $languages = $this->seedLookup('languages', [
            'Indonesia',
            'English',
        ], $now);

        $this->insertUser('Admin LMS', 'admin@lms.test', $now, 'admin');

        $instructorIds = [
            $this->insertUser('Rachma Academy', 'instructor@lms.test', $now, 'instructor'),
            $this->insertUser('Budi Santoso', 'budi@lms.test', $now, 'instructor'),
            $this->insertUser('Siti Aminah', 'siti@lms.test', $now, 'instructor'),
        ];

        $studentIds = [
            $this->insertUser('Andi Pratama', 'andi@lms.test', $now),
            $this->insertUser('Maya Putri', 'maya@lms.test', $now),
            $this->insertUser('Dewi Lestari', 'dewi@lms.test', $now),
            $this->insertUser('Rizky Maulana', 'rizky@lms.test', $now),
            $this->insertUser('Nadia Safira', 'nadia@lms.test', $now),
            $this->insertUser('Demo Student', 'student@lms.test', $now),
        ];

        $courses = [
            [
                'title' => 'Laravel 12 Fullstack LMS dari Nol',
                'user_id' => $instructorIds[0],
                'category_id' => $categories['Web Development'],
                'level_id' => $levels['Beginner'],
                'language_id' => $languages['Indonesia'],
                'price' => 249000,
                'cross_price' => 499000,
                'is_featured' => 'yes',
                'description' => 'Bangun aplikasi LMS modern memakai Laravel API, Sanctum, database relasional, dan praktik backend rapi dari nol sampai siap demo.',
                'requirements' => [
                    'Dasar PHP dan OOP sederhana.',
                    'Composer, PHP, dan database sudah terpasang.',
                    'Semangat membangun aplikasi nyata sampai selesai.',
                ],
                'outcomes' => [
                    'Membuat REST API LMS dengan Laravel.',
                    'Mengelola course, chapter, lesson, review, dan enrollment.',
                    'Mengamankan endpoint memakai Laravel Sanctum.',
                    'Menyiapkan data demo siap presentasi.',
                ],
                'chapters' => [
                    ['title' => 'Persiapan Project', 'lessons' => [
                        ['title' => 'Overview LMS dan Alur Belajar', 'duration' => 12, 'free' => 'yes'],
                        ['title' => 'Setup Environment Laravel', 'duration' => 18, 'free' => 'yes'],
                        ['title' => 'Struktur Folder dan Konvensi API', 'duration' => 15],
                    ]],
                    ['title' => 'Course Management', 'lessons' => [
                        ['title' => 'Membuat Migration Course', 'duration' => 22],
                        ['title' => 'Relasi Category Level Language', 'duration' => 24],
                        ['title' => 'Upload Cover dan Status Publish', 'duration' => 20],
                    ]],
                    ['title' => 'Enrollment dan Progress', 'lessons' => [
                        ['title' => 'Daftar Course Saya', 'duration' => 17],
                        ['title' => 'Tracking Lesson Selesai', 'duration' => 21],
                        ['title' => 'Generate Certificate', 'duration' => 19],
                    ]],
                ],
            ],
            [
                'title' => 'React Frontend untuk Platform Belajar',
                'user_id' => $instructorIds[1],
                'category_id' => $categories['Web Development'],
                'level_id' => $levels['Intermediate'],
                'language_id' => $languages['Indonesia'],
                'price' => 299000,
                'cross_price' => 599000,
                'is_featured' => 'yes',
                'description' => 'Pelajari cara membuat frontend LMS yang nyaman dilihat, cepat dipakai, dan terhubung ke API Laravel.',
                'requirements' => [
                    'Paham JavaScript dasar.',
                    'Sudah pernah memakai React component.',
                    'Mengerti request API memakai fetch atau axios.',
                ],
                'outcomes' => [
                    'Membuat halaman katalog course responsif.',
                    'Menghubungkan authentication ke backend.',
                    'Membuat halaman detail dan dashboard belajar.',
                    'Menangani loading, error, dan empty state.',
                ],
                'chapters' => [
                    ['title' => 'Fondasi React', 'lessons' => [
                        ['title' => 'Routing dan Layout Utama', 'duration' => 16, 'free' => 'yes'],
                        ['title' => 'Merapikan Komponen Course Card', 'duration' => 18, 'free' => 'yes'],
                        ['title' => 'State Management Ringan', 'duration' => 21],
                    ]],
                    ['title' => 'Integrasi API', 'lessons' => [
                        ['title' => 'Membuat API Client', 'duration' => 19],
                        ['title' => 'Filter Course dan Sorting', 'duration' => 23],
                        ['title' => 'Detail Course Dinamis', 'duration' => 24],
                    ]],
                    ['title' => 'Pengalaman Belajar', 'lessons' => [
                        ['title' => 'Halaman My Courses', 'duration' => 18],
                        ['title' => 'Progress Lesson dan Bookmark', 'duration' => 22],
                        ['title' => 'Certificate UI', 'duration' => 17],
                    ]],
                ],
            ],
            [
                'title' => 'Data Analytics dengan Python dan Spreadsheet',
                'user_id' => $instructorIds[2],
                'category_id' => $categories['Data Science'],
                'level_id' => $levels['Beginner'],
                'language_id' => $languages['Indonesia'],
                'price' => 199000,
                'cross_price' => 399000,
                'is_featured' => 'yes',
                'description' => 'Belajar membersihkan data, membuat insight, dan menyajikan dashboard sederhana untuk kebutuhan bisnis.',
                'requirements' => [
                    'Laptop dengan Python terpasang.',
                    'Paham spreadsheet dasar.',
                    'Tidak wajib pengalaman coding mendalam.',
                ],
                'outcomes' => [
                    'Membersihkan data mentah menjadi siap analisis.',
                    'Menggunakan pandas untuk laporan cepat.',
                    'Membuat grafik yang mudah dipahami.',
                    'Menyusun cerita data untuk keputusan bisnis.',
                ],
                'chapters' => [
                    ['title' => 'Dasar Analisis Data', 'lessons' => [
                        ['title' => 'Apa Itu Data Analytics', 'duration' => 10, 'free' => 'yes'],
                        ['title' => 'Mengenal Dataset Penjualan', 'duration' => 14, 'free' => 'yes'],
                        ['title' => 'Membersihkan Missing Value', 'duration' => 20],
                    ]],
                    ['title' => 'Python untuk Data', 'lessons' => [
                        ['title' => 'Pandas DataFrame', 'duration' => 24],
                        ['title' => 'Grouping dan Aggregation', 'duration' => 22],
                        ['title' => 'Export Laporan', 'duration' => 15],
                    ]],
                    ['title' => 'Visualisasi', 'lessons' => [
                        ['title' => 'Chart untuk KPI', 'duration' => 18],
                        ['title' => 'Dashboard Ringkas', 'duration' => 25],
                        ['title' => 'Presentasi Insight', 'duration' => 16],
                    ]],
                ],
            ],
            [
                'title' => 'UI/UX Design System untuk Pemula',
                'user_id' => $instructorIds[1],
                'category_id' => $categories['UI/UX Design'],
                'level_id' => $levels['Beginner'],
                'language_id' => $languages['Indonesia'],
                'price' => 179000,
                'cross_price' => 349000,
                'is_featured' => 'no',
                'description' => 'Bangun fondasi desain produk digital: riset pengguna, wireframe, komponen, warna, tipografi, dan prototype.',
                'requirements' => [
                    'Minat pada desain aplikasi.',
                    'Akun Figma atau tool desain sejenis.',
                    'Mau latihan lewat studi kasus.',
                ],
                'outcomes' => [
                    'Membuat user flow yang jelas.',
                    'Menyusun komponen desain konsisten.',
                    'Membuat prototype siap diuji.',
                    'Memberi alasan desain berbasis kebutuhan pengguna.',
                ],
                'chapters' => [
                    ['title' => 'Research dan Wireframe', 'lessons' => [
                        ['title' => 'Memahami Persona', 'duration' => 13, 'free' => 'yes'],
                        ['title' => 'User Journey Map', 'duration' => 19],
                        ['title' => 'Low Fidelity Wireframe', 'duration' => 21],
                    ]],
                    ['title' => 'Visual Design', 'lessons' => [
                        ['title' => 'Warna dan Tipografi', 'duration' => 17],
                        ['title' => 'Komponen Button dan Card', 'duration' => 20],
                        ['title' => 'Layout Responsif', 'duration' => 23],
                    ]],
                ],
            ],
            [
                'title' => 'Digital Marketing untuk UMKM',
                'user_id' => $instructorIds[2],
                'category_id' => $categories['Digital Marketing'],
                'level_id' => $levels['Beginner'],
                'language_id' => $languages['Indonesia'],
                'price' => 149000,
                'cross_price' => 299000,
                'is_featured' => 'no',
                'description' => 'Strategi praktis membuat konten, membaca metrik, dan meningkatkan penjualan online untuk bisnis kecil.',
                'requirements' => [
                    'Memiliki produk atau ide bisnis.',
                    'Punya akun media sosial bisnis.',
                    'Siap mencoba kampanye sederhana.',
                ],
                'outcomes' => [
                    'Menyusun kalender konten satu bulan.',
                    'Menentukan target audience dengan jelas.',
                    'Membaca metrik campaign dasar.',
                    'Membuat landing page sederhana.',
                ],
                'chapters' => [
                    ['title' => 'Strategi Konten', 'lessons' => [
                        ['title' => 'Menentukan Audience', 'duration' => 15, 'free' => 'yes'],
                        ['title' => 'Content Pillar', 'duration' => 18],
                        ['title' => 'Copywriting Promosi', 'duration' => 22],
                    ]],
                    ['title' => 'Optimasi Campaign', 'lessons' => [
                        ['title' => 'Metrik yang Perlu Dipantau', 'duration' => 20],
                        ['title' => 'A/B Testing Konten', 'duration' => 16],
                        ['title' => 'Retargeting Dasar', 'duration' => 24],
                    ]],
                ],
            ],
            [
                'title' => 'Flutter Mobile App Cepat Jadi',
                'user_id' => $instructorIds[0],
                'category_id' => $categories['Mobile Development'],
                'level_id' => $levels['Intermediate'],
                'language_id' => $languages['Indonesia'],
                'price' => 329000,
                'cross_price' => 649000,
                'is_featured' => 'yes',
                'description' => 'Buat aplikasi mobile katalog kelas dengan Flutter, state sederhana, konsumsi API, dan tampilan profesional.',
                'requirements' => [
                    'Dart dan Flutter sudah terpasang.',
                    'Paham dasar widget Flutter.',
                    'Mengerti JSON dan REST API.',
                ],
                'outcomes' => [
                    'Membuat UI mobile yang responsif.',
                    'Mengambil data course dari API.',
                    'Menerapkan state loading dan error.',
                    'Menyiapkan build Android untuk demo.',
                ],
                'chapters' => [
                    ['title' => 'Setup dan Layout', 'lessons' => [
                        ['title' => 'Project Flutter Baru', 'duration' => 12, 'free' => 'yes'],
                        ['title' => 'Theme dan Navigation', 'duration' => 18],
                        ['title' => 'Course Card Widget', 'duration' => 20],
                    ]],
                    ['title' => 'API dan State', 'lessons' => [
                        ['title' => 'HTTP Client', 'duration' => 17],
                        ['title' => 'List Course Dinamis', 'duration' => 25],
                        ['title' => 'Detail Screen', 'duration' => 22],
                    ]],
                ],
            ],
        ];

        $courseIds = [];
        foreach ($courses as $courseIndex => $courseData) {
            $courseIds[] = $this->seedCourse($courseData, $courseIndex, $now);
        }

        $this->seedLearningPaths($courseIds, $now);
        $this->seedStudentData($studentIds, $courseIds, $now);
    }

    private function clearTables(): void
    {
        Schema::disableForeignKeyConstraints();

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('TRUNCATE TABLE learning_path_courses, learning_paths, certificates, course_bookmarks, activities, reviews, enrollments, lessons, chapters, requirements, outcomes, courses, categories, languages, levels, model_has_roles, model_has_permissions, role_has_permissions, roles, permissions, users RESTART IDENTITY CASCADE');
        } else {
            foreach ([
                'learning_path_courses',
                'learning_paths',
                'certificates',
                'course_bookmarks',
                'activities',
                'reviews',
                'enrollments',
                'lessons',
                'chapters',
                'requirements',
                'outcomes',
                'courses',
                'categories',
                'languages',
                'levels',
                'model_has_permissions',
                'model_has_roles',
                'role_has_permissions',
                'roles',
                'permissions',
                'users',
            ] as $table) {
                DB::table($table)->truncate();
            }
        }

        Schema::enableForeignKeyConstraints();
    }

    private function seedRolesAndPermissions($now): void
    {
        $permissions = ['manage admin', 'manage roles', 'manage courses', 'review submissions', 'learn courses'];
        $roles = ['admin', 'instructor', 'student'];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permission, 'guard_name' => 'web'],
                ['created_at' => $now, 'updated_at' => $now]
            );
        }

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role, 'guard_name' => 'web'],
                ['created_at' => $now, 'updated_at' => $now]
            );
        }

        $roleIds = DB::table('roles')->pluck('id', 'name');
        $permissionIds = DB::table('permissions')->pluck('id', 'name');
        $rolePermissions = [
            'admin' => $permissions,
            'instructor' => ['manage courses', 'review submissions', 'learn courses'],
            'student' => ['learn courses'],
        ];

        foreach ($rolePermissions as $role => $permissionNames) {
            foreach ($permissionNames as $permission) {
                DB::table('role_has_permissions')->updateOrInsert([
                    'permission_id' => $permissionIds[$permission],
                    'role_id' => $roleIds[$role],
                ]);
            }
        }
    }

    private function seedLookup(string $table, array $names, $now): array
    {
        $ids = [];

        foreach ($names as $name) {
            $ids[$name] = DB::table($table)->insertGetId([
                'name' => $name,
                'status' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        return $ids;
    }

    private function insertUser(string $name, string $email, $now, string $role = 'student'): int
    {
        $userId = DB::table('users')->insertGetId([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => $now,
            'password' => Hash::make('password'),
            'role' => $role,
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $roleId = DB::table('roles')->where('name', $role)->value('id');
        if ($roleId) {
            DB::table('model_has_roles')->updateOrInsert([
                'role_id' => $roleId,
                'model_type' => 'App\\Models\\User',
                'model_id' => $userId,
            ]);
        }

        return $userId;
    }

    private function seedCourse(array $courseData, int $courseIndex, $now): int
    {
        $courseId = DB::table('courses')->insertGetId([
            'title' => $courseData['title'],
            'user_id' => $courseData['user_id'],
            'category_id' => $courseData['category_id'],
            'level_id' => $courseData['level_id'],
            'language_id' => $courseData['language_id'],
            'description' => $courseData['description'],
            'price' => $courseData['price'],
            'cross_price' => $courseData['cross_price'],
            'status' => 1,
            'is_featured' => $courseData['is_featured'],
            'image' => '',
            'created_at' => $now->copy()->subDays(count($courseData['chapters']) + $courseIndex),
            'updated_at' => $now,
        ]);

        foreach ($courseData['outcomes'] as $index => $text) {
            DB::table('outcomes')->insert([
                'course_id' => $courseId,
                'text' => $text,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($courseData['requirements'] as $index => $text) {
            DB::table('requirements')->insert([
                'course_id' => $courseId,
                'text' => $text,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        foreach ($courseData['chapters'] as $chapterIndex => $chapterData) {
            $chapterId = DB::table('chapters')->insertGetId([
                'title' => $chapterData['title'],
                'course_id' => $courseId,
                'sort_order' => $chapterIndex + 1,
                'status' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ($chapterData['lessons'] as $lessonIndex => $lessonData) {
                DB::table('lessons')->insert([
                    'title' => $lessonData['title'],
                    'chapter_id' => $chapterId,
                    'is_free_preview' => $lessonData['free'] ?? 'no',
                    'duration' => $lessonData['duration'],
                    'video' => 'demo-course-' . $courseId . '-lesson-' . ($lessonIndex + 1) . '.mp4',
                    'description' => 'Materi praktik: ' . $lessonData['title'] . '. Ikuti langkah belajar sampai selesai agar progress tersimpan.',
                    'sort_order' => $lessonIndex + 1,
                    'status' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        return $courseId;
    }

    private function seedLearningPaths(array $courseIds, $now): void
    {
        $paths = [
            [
                'title' => 'Backend Developer Laravel',
                'slug' => 'backend-developer-laravel',
                'description' => 'Jalur belajar dari dasar Laravel API sampai LMS siap portofolio.',
                'career_goal' => 'Backend Developer',
                'estimated_hours' => 42,
                'courses' => [0, 3],
            ],
            [
                'title' => 'Frontend Developer React',
                'slug' => 'frontend-developer-react',
                'description' => 'Jalur belajar React untuk membuat UI LMS modern, responsif, dan terhubung API.',
                'career_goal' => 'Frontend Developer',
                'estimated_hours' => 38,
                'courses' => [1, 2],
            ],
            [
                'title' => 'Fullstack Web Developer',
                'slug' => 'fullstack-web-developer',
                'description' => 'Gabungan backend, frontend, UI/UX, dan praktik project nyata seperti platform pembelajaran.',
                'career_goal' => 'Fullstack Developer',
                'estimated_hours' => 72,
                'courses' => [0, 1, 2, 3],
            ],
        ];

        foreach ($paths as $pathIndex => $path) {
            $pathId = DB::table('learning_paths')->insertGetId([
                'title' => $path['title'],
                'slug' => $path['slug'],
                'description' => $path['description'],
                'career_goal' => $path['career_goal'],
                'estimated_hours' => $path['estimated_hours'],
                'sort_order' => $pathIndex + 1,
                'status' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ($path['courses'] as $courseOrder => $courseIndex) {
                if (!isset($courseIds[$courseIndex])) {
                    continue;
                }

                DB::table('learning_path_courses')->insert([
                    'learning_path_id' => $pathId,
                    'course_id' => $courseIds[$courseIndex],
                    'sort_order' => $courseOrder + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    private function seedStudentData(array $studentIds, array $courseIds, $now): void
    {
        $reviewComments = [
            'Materinya runtut, contoh kasus jelas, dan cocok untuk latihan mandiri.',
            'Tampilan course bagus. Penjelasan mentor mudah diikuti.',
            'Sangat membantu untuk memahami alur project nyata.',
            'Latihan praktisnya lengkap dan data demonya terasa realistis.',
            'Kualitas kelas bagus, cocok untuk portofolio.',
            'Pembahasan detail tetapi tetap mudah dipahami pemula.',
        ];

        foreach ($courseIds as $courseIndex => $courseId) {
            $courseStudentIds = array_slice($studentIds, 0, 4 + ($courseIndex % 3));

            foreach ($courseStudentIds as $studentIndex => $studentId) {
                DB::table('enrollments')->insert([
                    'user_id' => $studentId,
                    'course_id' => $courseId,
                    'created_at' => $now->copy()->subDays($studentIndex + $courseIndex),
                    'updated_at' => $now,
                ]);

                if (($studentIndex + $courseIndex) % 2 === 0) {
                    DB::table('course_bookmarks')->insertOrIgnore([
                        'user_id' => $studentId,
                        'course_id' => $courseId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }

                if ($studentIndex < 3) {
                    DB::table('reviews')->insert([
                        'user_id' => $studentId,
                        'course_id' => $courseId,
                        'rating' => min(5, 4 + (($studentIndex + $courseIndex) % 2)),
                        'comment' => $reviewComments[($studentIndex + $courseIndex) % count($reviewComments)],
                        'status' => 1,
                        'created_at' => $now->copy()->subDays($studentIndex + 1),
                        'updated_at' => $now,
                    ]);
                }
            }

            $demoStudentId = $studentIds[count($studentIds) - 1];
            $lessons = DB::table('lessons')
                ->join('chapters', 'chapters.id', '=', 'lessons.chapter_id')
                ->where('chapters.course_id', $courseId)
                ->orderBy('chapters.sort_order')
                ->orderBy('lessons.sort_order')
                ->select('lessons.id', 'lessons.chapter_id')
                ->get();

            foreach ($lessons as $lessonIndex => $lesson) {
                DB::table('activities')->insert([
                    'user_id' => $demoStudentId,
                    'course_id' => $courseId,
                    'chapter_id' => $lesson->chapter_id,
                    'lesson_id' => $lesson->id,
                    'is_complete' => $courseIndex < 2 || $lessonIndex < 4 ? 'yes' : 'no',
                    'is_last_watched' => $lessonIndex === min(4, $lessons->count() - 1) ? 'yes' : 'no',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            if ($courseIndex < 2) {
                DB::table('certificates')->insertOrIgnore([
                    'user_id' => $demoStudentId,
                    'course_id' => $courseId,
                    'certificate_number' => 'CERT-' . $now->format('Ymd') . '-' . str_pad((string) ($courseIndex + 1), 4, '0', STR_PAD_LEFT),
                    'issued_at' => $now->copy()->subDays($courseIndex),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
