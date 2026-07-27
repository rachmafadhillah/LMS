# LMS Product Requirements Document

## Ringkasan

Project ini adalah LMS berbasis Laravel 12 API, React/Vite frontend, dan PostgreSQL. Fokus produk: siswa bisa menemukan course, belajar lesson terstruktur, tracking progress, memberi review; instructor bisa membuat course, chapter, lesson, outcome, requirement, dan memantau performa course.

## Tujuan Produk

1. Membuat pengalaman belajar jelas dari daftar course sampai selesai lesson.
2. Membuat authoring course rapi untuk instructor tanpa admin panel berat.
3. Membuat progress belajar akurat dan mudah dilanjutkan.
4. Menjaga architecture sederhana, mudah dirawat, dan tidak over-engineering.

## User Role

### Guest
- Melihat homepage, kategori, course featured, semua course, detail course.
- Register dan login.
- Melihat free preview jika lesson ditandai `is_free_preview`.

### Student
- Enroll course.
- Melihat course yang sudah di-enroll.
- Menonton lesson.
- Menandai lesson selesai.
- Melanjutkan lesson terakhir.
- Memberi rating dan review.
- Mengubah profil dan password.

### Instructor
- Semua kemampuan student.
- Membuat, mengedit, publish/unpublish, dan menghapus course miliknya.
- Mengelola chapter, lesson, outcome, requirement.
- Melihat jumlah enrollment, review, rating, dan progress umum course.

### Admin Future
- Mengelola user, kategori, level, bahasa.
- Moderasi course dan review.
- Melihat laporan platform.

Admin belum prioritas kecuali dibutuhkan.

## Scope Saat Ini

Sudah ada:
- Auth register/login dengan Sanctum token.
- Course listing, detail, featured course.
- Category, level, language.
- CRUD course milik user.
- Chapter, lesson, requirement, outcome.
- Enrollment.
- Activity/progress lesson.
- Review/rating.
- Profile dan password.

## Feature Gap Prioritas

### P0 - Wajib Dirapikan Dulu
1. API response standard: semua endpoint pakai format sama.
2. Authorization policy: user hanya bisa edit course miliknya dan access course enrolled.
3. Request validation: pindahkan validasi dari controller ke `FormRequest`.
4. Database constraints: unique enrollment, unique activity per user+lesson, unique review per user+course.
5. Frontend API client: centralize fetch/axios, token dari auth state, error handler seragam.

### P1 - Fitur Produk Bagus
1. Continue learning: tampilkan course dan lesson terakhir di dashboard.
2. Progress percentage: hitung persen lesson selesai per course.
3. Course search/filter/sort: keyword, category, level, language, rating, newest.
4. Certificate sederhana: keluar jika semua lesson selesai.
5. Instructor analytics ringan: total student, total review, average rating, completion rate.
6. Draft/publish workflow: course draft, published, archived.

### P2 - Nice To Have
1. Bookmark course.
2. Notes per lesson.
3. Quiz sederhana per lesson/chapter.
4. Discussion/Q&A per course.
5. Notification basic untuk enrollment/review.
6. Admin review moderation.

## MVP Tambahan Rekomendasi

Urutan paling masuk akal:

1. Rapikan foundation API + FE API client.
2. Tambah progress percentage + continue learning.
3. Tambah search/filter/sort course.
4. Tambah certificate sederhana.
5. Tambah instructor analytics.

Alasan: fitur ini langsung meningkatkan pengalaman belajar, tidak butuh sistem besar, dan cocok dengan schema yang sudah ada.

## Non-Goals

- Microservices.
- Event sourcing.
- Complex DDD folder berlebihan.
- Payment gateway sebelum course flow stabil.
- Realtime chat sebelum basic LMS matang.
- Admin dashboard besar sebelum role/authorization rapi.

## Success Metrics

- Student bisa enroll dan menyelesaikan course tanpa bug progress.
- Instructor bisa publish course lengkap tanpa data rusak.
- API error konsisten dan mudah ditampilkan FE.
- Query course tidak lambat saat data bertambah.
- Code mudah dicari: controller tipis, logic di service/action.
