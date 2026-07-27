# LMS Architecture Guide

## Stack

- Backend: Laravel 12 API.
- Auth: Laravel Sanctum token.
- Frontend: React + Vite.
- Database: PostgreSQL 17.
- Runtime script: `scripts/setup.bat`, `scripts/run.bat`.

## Prinsip Architecture

1. Sederhana dulu, modular secukupnya.
2. Controller tipis: validasi, authorization, panggil service/action, return response.
3. Business logic jangan ditaruh di React component.
4. Query berat jangan tersebar di component/controller.
5. Migration jadi sumber kebenaran schema.
6. Nama domain konsisten: Course, Chapter, Lesson, Enrollment, Activity, Review.

## Backend Struktur Disarankan

```text
backend/app
+-- Http
¦   +-- Controllers/Api
¦   +-- Requests
¦   +-- Resources
+-- Models
+-- Policies
+-- Services
+-- Support
```

Gunakan bertahap. Tidak perlu refactor semua sekaligus.

### Controller

Controller hanya boleh:
- Terima request.
- Pakai `FormRequest` untuk validasi.
- Pakai policy/gate untuk authorization.
- Panggil service/action jika logic lebih dari CRUD sederhana.
- Return `JsonResource` atau response helper.

### FormRequest

Gunakan untuk endpoint create/update:
- `StoreCourseRequest`
- `UpdateCourseRequest`
- `StoreLessonRequest`
- `UpdateLessonRequest`
- `UpdateProfileRequest`
- `ChangePasswordRequest`

### Service/Action

Gunakan jika logic punya efek samping atau banyak langkah:
- `CourseImageService`
- `LessonVideoService`
- `CourseProgressService`
- `CoursePublishingService`
- `CertificateService`

### Policy

Minimal policy:
- `CoursePolicy`: update/delete/publish hanya owner.
- `LessonPolicy`: manage lesson lewat owner course.
- `EnrollmentPolicy`: view enrolled course hanya student enrolled atau owner course.
- `ReviewPolicy`: review hanya user enrolled dan satu kali per course.

## Frontend Struktur Disarankan

```text
frontend/src
+-- app
¦   +-- router.jsx
¦   +-- providers.jsx
+-- components
¦   +-- common
¦   +-- ui
+-- features
¦   +-- auth
¦   +-- courses
¦   +-- learning
¦   +-- instructor
+-- lib
¦   +-- api.js
¦   +-- auth.js
¦   +-- format.js
+-- assets
```

Pindah bertahap dari `components/pages` ke `features`. Jangan rewrite besar tanpa kebutuhan.

### Component Rules

- Page component: ambil data, handle route, susun layout.
- Feature component: logic domain spesifik.
- UI component: tombol, input, card, modal, loading; tidak tahu API.
- Common component: layout, header, footer, sidebar.
- Hindari file component terlalu besar. Jika lebih dari 250 baris, pecah.

### API Client

Buat satu pintu API:
- Base URL dari `VITE_API_URL`.
- Token dibaca dari auth storage/state.
- Handle `401` dengan logout.
- Handle validation error format Laravel.
- Jangan ulang `fetch` config di banyak component.

## API Response Standard

Sukses:

```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {}
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

Error umum:

```json
{
  "success": false,
  "message": "Course not found."
}
```

HTTP status harus benar:
- `200` OK.
- `201` Created.
- `204` No Content.
- `400` Bad Request.
- `401` Unauthenticated.
- `403` Forbidden.
- `404` Not Found.
- `422` Validation failed.

## Database Architecture

### Existing Core Tables

- `users`: account.
- `courses`: course metadata.
- `categories`: course category.
- `levels`: difficulty level.
- `languages`: course language.
- `chapters`: course section.
- `lessons`: learning unit.
- `outcomes`: course learning outcome.
- `requirements`: course prerequisite.
- `enrollments`: student enrollment.
- `activities`: lesson progress.
- `reviews`: course rating/review.

### Constraint Wajib Ditambah

- `enrollments`: unique `user_id, course_id`.
- `activities`: unique `user_id, lesson_id`.
- `reviews`: unique `user_id, course_id`.
- `lessons`: index `chapter_id, sort_order`.
- `chapters`: index `course_id, sort_order`.
- `courses`: index `status, is_featured`, `category_id`, `level_id`, `language_id`.

### Column Improvement Bertahap

- Ganti enum `yes/no` menjadi boolean untuk data baru jika memungkinkan.
- Ganti integer `status` magic number menjadi enum/string atau constants model.
- `price` dan `cross_price` pakai `decimal`, bukan `double`.
- Tambah `slug` pada `courses` untuk URL stabil.
- Tambah `published_at` pada `courses`.
- Tambah `last_watched_at` atau `completed_at` pada progress jika perlu analytics.

## Feature Data Model Future

### Certificates

`certificates`:
- `id`
- `user_id`
- `course_id`
- `certificate_number`
- `issued_at`
- `created_at`
- `updated_at`

Constraint: unique `user_id, course_id`, unique `certificate_number`.

### Lesson Notes

`lesson_notes`:
- `id`
- `user_id`
- `lesson_id`
- `body`
- `created_at`
- `updated_at`

Constraint: index `user_id, lesson_id`.

### Bookmarks

`course_bookmarks`:
- `id`
- `user_id`
- `course_id`
- `created_at`

Constraint: unique `user_id, course_id`.

## Refactor Order Aman

1. Tambah API response helper/resource tanpa ubah behavior besar.
2. Tambah constraints migration baru.
3. Tambah policies pada endpoint sensitif.
4. Pindahkan validasi ke `FormRequest` per endpoint.
5. Buat frontend API client, migrasi page satu per satu.
6. Tambah progress percentage dan continue learning.
