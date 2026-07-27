# LMS Feature Roadmap

## Analisis Singkat

Project sudah punya pondasi LMS: course catalog, course authoring, enrollment, lesson video, activity progress, review, dan profile. Penambahan terbaik bukan fitur besar dulu, tapi fitur yang membuat learning flow terasa lengkap dan data tidak mudah rusak.

## Prioritas 1: Foundation Quality

### 1. Standard API Response

Masalah: response sekarang campur `status`, `data`, `message`, dan kadang HTTP status tidak ideal.

Solusi:
- Buat helper response atau base controller method.
- Semua endpoint baru pakai `success/message/data/errors`.
- Migrasi endpoint lama bertahap.

Value:
- Frontend error handling jauh lebih rapi.
- Debug lebih mudah.

### 2. Frontend API Client

Masalah: token dan request config rawan tersebar.

Solusi:
- Buat `frontend/src/lib/api.js`.
- Centralize base URL, Authorization header, JSON parsing, error handling.
- Auto logout jika `401`.

Value:
- Component lebih bersih.
- Behavior login konsisten.

### 3. Authorization + Constraint

Masalah: LMS sensitif ownership. Course dan progress harus aman.

Solusi:
- Policy untuk Course/Lesson/Enrollment/Review.
- Unique constraint enrollment, activity, review.

Value:
- Data tidak duplicate.
- User tidak bisa edit data orang lain.

## Prioritas 2: Learning Experience

### 4. Continue Learning

User story:
- Sebagai student, saya ingin melanjutkan lesson terakhir supaya tidak mencari manual.

Backend:
- Endpoint `GET /api/learning/continue`.
- Return course, chapter, lesson, progress.

Frontend:
- Card di dashboard: course terakhir, lesson terakhir, tombol lanjutkan.

Data:
- Pakai `activities.is_last_watched` existing.
- Future: tambah `last_watched_at`.

### 5. Progress Percentage

User story:
- Sebagai student, saya ingin melihat persen progress course.

Backend:
- Hitung completed lesson / total lesson aktif.
- Service: `CourseProgressService`.

Frontend:
- Progress bar di My Learning dan Watch Course.

### 6. Search, Filter, Sort Course

User story:
- Sebagai guest/student, saya ingin mencari course sesuai kebutuhan.

Filter:
- Keyword title.
- Category.
- Level.
- Language.
- Rating.
- Newest.

Backend:
- Extend `fetch-courses` dengan query params.
- Add pagination.

Frontend:
- Search bar, filter sidebar/dropdown, sort select.

## Prioritas 3: Completion and Instructor Value

### 7. Certificate Sederhana

User story:
- Sebagai student, saya ingin bukti selesai course.

Rules:
- Certificate keluar jika progress 100%.
- Satu certificate per user+course.
- Bisa download/lihat halaman certificate.

Tidak perlu PDF bagus dulu. HTML printable cukup untuk MVP.

### 8. Instructor Analytics Ringan

User story:
- Sebagai instructor, saya ingin tahu performa course saya.

Metrics:
- Total enrollments.
- Average rating.
- Total reviews.
- Completion rate.
- Top lessons watched.

Backend:
- Endpoint `GET /api/instructor/courses/{id}/analytics`.

Frontend:
- Cards kecil di edit course/dashboard.

## Prioritas 4: Engagement

### 9. Lesson Notes

Student bisa catat per lesson.

### 10. Course Q&A

Discussion sederhana per course, bukan realtime.

### 11. Bookmark Course

Save course sebelum enroll.

## Jangan Dibuat Dulu

- Payment gateway.
- Live class realtime.
- Chat realtime.
- Complex admin RBAC.
- Microservice/event bus.
- AI recommendation system.

Semua itu boleh nanti setelah progress, search, certificate, dan analytics stabil.
