# LMS Database Plan

## Current Domain

```text
User
+-- has many Course as instructor
+-- has many Enrollment as student
+-- has many Activity
+-- has many Review

Course
+-- belongs to User owner
+-- belongs to Category
+-- belongs to Level
+-- belongs to Language
+-- has many Chapter
+-- has many Outcome
+-- has many Requirement
+-- has many Enrollment
+-- has many Review

Chapter
+-- has many Lesson

Lesson
+-- has many Activity
```

## Existing Tables

| Table | Purpose |
|---|---|
| `users` | Account student/instructor |
| `courses` | Course metadata dan ownership |
| `categories` | Category master |
| `levels` | Difficulty master |
| `languages` | Language master |
| `chapters` | Section dalam course |
| `lessons` | Video lesson dalam chapter |
| `outcomes` | Hasil belajar course |
| `requirements` | Prasyarat course |
| `enrollments` | Student join course |
| `activities` | Progress lesson student |
| `reviews` | Rating dan comment course |

## Constraint dan Index Wajib

Migration baru disarankan:

```php
Schema::table('enrollments', function (Blueprint $table) {
    $table->unique(['user_id', 'course_id']);
});

Schema::table('activities', function (Blueprint $table) {
    $table->unique(['user_id', 'lesson_id']);
    $table->index(['user_id', 'course_id']);
    $table->index(['course_id', 'is_complete']);
});

Schema::table('reviews', function (Blueprint $table) {
    $table->unique(['user_id', 'course_id']);
    $table->index(['course_id', 'status']);
});

Schema::table('courses', function (Blueprint $table) {
    $table->index(['status', 'is_featured']);
    $table->index('category_id');
    $table->index('level_id');
    $table->index('language_id');
});

Schema::table('chapters', function (Blueprint $table) {
    $table->index(['course_id', 'sort_order']);
});

Schema::table('lessons', function (Blueprint $table) {
    $table->index(['chapter_id', 'sort_order']);
    $table->index(['status', 'is_free_preview']);
});
```

## Data Integrity Rules

- Enrollment tidak boleh duplicate.
- Activity tidak boleh duplicate untuk user dan lesson yang sama.
- Review tidak boleh duplicate untuk user dan course yang sama.
- Rating harus `1..5`.
- Lesson hanya bisa dibuat di chapter milik course owner.
- Progress hanya bisa dibuat jika user enrolled.
- Course delete harus ikut bersihkan file image/video atau pakai storage abstraction.

## Future Tables

### `certificates`

| Column | Type | Note |
|---|---|---|
| `id` | bigserial | PK |
| `user_id` | foreignId | Student |
| `course_id` | foreignId | Course |
| `certificate_number` | string | Unique public number |
| `issued_at` | timestamp | Waktu terbit |
| `created_at` | timestamp | Laravel |
| `updated_at` | timestamp | Laravel |

Constraints:
- unique `user_id, course_id`
- unique `certificate_number`

### `lesson_notes`

| Column | Type | Note |
|---|---|---|
| `id` | bigserial | PK |
| `user_id` | foreignId | Student |
| `lesson_id` | foreignId | Lesson |
| `body` | text | Catatan |
| `created_at` | timestamp | Laravel |
| `updated_at` | timestamp | Laravel |

Index:
- `user_id, lesson_id`

### `course_bookmarks`

| Column | Type | Note |
|---|---|---|
| `id` | bigserial | PK |
| `user_id` | foreignId | User |
| `course_id` | foreignId | Course |
| `created_at` | timestamp | Laravel |

Constraint:
- unique `user_id, course_id`

## Naming Rules

- Table pakai plural snake_case.
- Foreign key pakai singular `_id`.
- Boolean baru pakai `is_*` atau `has_*` dengan boolean type.
- Timestamp event pakai `*_at`.
- Jangan pakai `double` untuk uang. Pakai `decimal(10,2)`.
