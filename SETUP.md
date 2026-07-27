# Panduan Setup LMS AkademiKita dari Nol

Panduan ini untuk menjalankan project LMS di Windows dari awal sampai bisa login, memakai Laravel 12 API, React/Vite frontend, PostgreSQL, Laravel Sanctum, dan Spatie Permission.

## 1. Yang Harus Di-download

Install dulu aplikasi berikut:

1. **Laragon**
   - Disarankan karena sudah mudah mengatur PHP, Composer, Apache/Nginx, dan terminal.
   - Project ini memakai PHP `8.2.29`.
   - Path yang dipakai script bawaan: `C:\laragon\bin\php\php-8.2.29-nts-Win32-vs16-x64`

2. **PHP 8.2 atau lebih baru**
   - Minimal sesuai `backend/composer.json`: `^8.2`.
   - Jangan pakai PHP 8.1 karena Laravel 12 dan dependency butuh PHP 8.2+.
   - Cek versi:
     ```powershell
     php -v
     ```

3. **Composer**
   - Untuk install dependency Laravel.
   - Cek:
     ```powershell
     composer -V
     ```

4. **Node.js + npm**
   - Untuk React/Vite frontend.
   - Disarankan Node.js LTS terbaru.
   - Cek:
     ```powershell
     node -v
     npm -v
     ```

5. **PostgreSQL 17 + pgAdmin**
   - Script bawaan mengarah ke PostgreSQL di port `5434`.
   - Path yang dipakai script bawaan: `C:\Program Files\PostgreSQL\17\bin`
   - Database default: `lms`
   - User default: `postgres`
   - Password default di `.env`: kosong

6. **Git**
   - Untuk clone project.
   - Cek:
     ```powershell
     git --version
     ```

## 2. Clone atau Buka Project

Kalau project sudah ada, buka folder root:

```powershell
cd "D:\lms rachma\LMS"
```

Struktur utama:

```text
LMS/
+-- backend/      # Laravel 12 API
+-- frontend/     # React + Vite
+-- scripts/      # script setup/run Windows
+-- docs/         # dokumentasi tambahan jika ada
+-- README.md
```



## 2A. Setup PostgreSQL dari Awal

Bagian ini untuk kondisi laptop baru atau database belum siap sama sekali.

### 2A.1 Install PostgreSQL

1. Download PostgreSQL Windows dari website resmi PostgreSQL.
2. Install PostgreSQL versi 17.
3. Saat installer meminta password user `postgres`, pilih salah satu:
   - Kosongkan password jika installer mengizinkan, sesuai `.env` project sekarang.
   - Atau isi password sendiri, lalu nanti isi `DB_PASSWORD` di `backend/.env`.
4. Pastikan pgAdmin ikut terinstall.
5. Catat port PostgreSQL:
   - Project ini default pakai `5434`.
   - PostgreSQL default biasanya `5432`.
   - Kalau installer kamu pakai `5432`, ubah `.env` dan script ke `5432`.

### 2A.2 Cek Service PostgreSQL Jalan

Buka PowerShell, cek service:

```powershell
Get-Service | Where-Object { $_.Name -like '*postgres*' }
```

Kalau service stopped, nyalakan dari Windows Services atau pakai:

```powershell
Start-Service postgresql-x64-17
```

Nama service bisa beda. Kalau beda, lihat dari hasil `Get-Service`.

### 2A.3 Cek Command PostgreSQL Bisa Dipakai

Project script pakai path ini:

```text
C:\Program Files\PostgreSQL\17\bin
```

Cek manual:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" --version
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" --version
```

Kalau mau pakai langsung tanpa path panjang, tambahkan folder ini ke Environment Variables `PATH`:

```text
C:\Program Files\PostgreSQL\17\bin
```

Lalu buka terminal baru dan cek:

```powershell
psql --version
createdb --version
```

### 2A.4 Cek Port PostgreSQL

Cek port yang sedang listen:

```powershell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 5432,5434 }
```

Cek koneksi port `5434`:

```powershell
psql -h 127.0.0.1 -p 5434 -U postgres -d postgres
```

Kalau gagal dan PostgreSQL kamu pakai port `5432`, cek:

```powershell
psql -h 127.0.0.1 -p 5432 -U postgres -d postgres
```

Keluar dari `psql`:

```sql
\q
```

### 2A.5 Buat Database `lms`

Jika pakai port `5434`:

```powershell
createdb -h 127.0.0.1 -p 5434 -U postgres lms
```

Jika pakai port `5432`:

```powershell
createdb -h 127.0.0.1 -p 5432 -U postgres lms
```

Cek database sudah ada:

```powershell
psql -h 127.0.0.1 -p 5434 -U postgres -d postgres -c "SELECT datname FROM pg_database WHERE datname = 'lms';"
```

Jika port `5432`, ganti `-p 5434` menjadi `-p 5432`.

### 2A.6 Buat Database dari pgAdmin

Alternatif tanpa terminal:

1. Buka pgAdmin.
2. Connect ke server PostgreSQL lokal.
3. Klik kanan `Databases`.
4. Pilih `Create` lalu `Database`.
5. Isi `Database` dengan:
   ```text
   lms
   ```
6. Owner pilih:
   ```text
   postgres
   ```
7. Klik `Save`.

### 2A.7 Sesuaikan `backend/.env`

Buka file:

```text
backend/.env
```

Untuk PostgreSQL port `5434` tanpa password:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5434
DB_DATABASE=lms
DB_USERNAME=postgres
DB_PASSWORD=
```

Untuk PostgreSQL port `5432` dengan password:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lms
DB_USERNAME=postgres
DB_PASSWORD=password_kamu
```

Setelah ubah `.env`, jalankan:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan optimize:clear
```

### 2A.8 Tes Laravel Bisa Konek ke PostgreSQL

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan tinker
```

Di tinker:

```php
DB::connection()->getDatabaseName();
DB::select('select version()');
```

Keluar:

```php
exit
```

Kalau error `could not connect`, cek ulang service, port, username, password, dan `backend/.env`.

## 2B. Seeder Lengkap dari Awal

Seeder wajib dijalankan agar akun login, role permission, course, enrollment, learning path, activity, certificate, dan data demo tersedia.

### 2B.1 Jalankan Migration + Seeder Pertama Kali

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan migrate --seed
```

Command ini membuat semua tabel dan isi data demo.

### 2B.2 Reset Total Database dan Seed Ulang

Gunakan ini kalau data boleh dihapus semua:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan migrate:fresh --seed
```

Efek command:

- Semua tabel dihapus dan dibuat ulang.
- Semua data lama hilang.
- Seeder mengisi data demo baru.
- Akun default muncul lagi.
- Role dan permission Spatie dibuat lagi.

### 2B.3 Data yang Dibuat Seeder

Seeder mengisi:

- User admin, instructor, student.
- Role Spatie: `admin`, `instructor`, `student`.
- Permission Spatie: `manage admin`, `manage roles`, `manage courses`, `review submissions`, `learn courses`.
- Category course.
- Level course.
- Language course.
- Course demo.
- Chapter dan lesson demo.
- Outcome dan requirement course.
- Enrollment student.
- Activity belajar student.
- Review course.
- Bookmark course.
- Certificate.
- Learning path.
- Submission demo jika migration/data mendukung.

### 2B.4 Akun Login Hasil Seeder

Semua password:

```text
password
```

| Role | Email | Password | Akses |
|---|---|---|---|
| Admin | `admin@lms.test` | `password` | Admin permission, semua akses |
| Instructor | `instructor@lms.test` | `password` | My Courses, review submissions |
| Instructor | `budi@lms.test` | `password` | My Courses |
| Instructor | `siti@lms.test` | `password` | My Courses |
| Student | `andi@lms.test` | `password` | My Learning, submit project |
| Student | `maya@lms.test` | `password` | My Learning, submit project |
| Student | `dewi@lms.test` | `password` | My Learning, submit project |
| Student | `rizky@lms.test` | `password` | My Learning, submit project |
| Student | `nadia@lms.test` | `password` | My Learning, submit project |
| Student | `student@lms.test` | `password` | Demo student lengkap |

### 2B.5 Cek Seeder Berhasil

Cek jumlah user:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan tinker --execute="dump(App\Models\User::count()); dump(App\Models\User::select('id','name','email','role')->get());"
```

Cek role Spatie:

```powershell
php artisan tinker --execute="dump(Spatie\Permission\Models\Role::with('permissions')->get());"
```

Cek course:

```powershell
php artisan tinker --execute="dump(App\Models\Course::count());"
```

### 2B.6 Kalau Seeder Gagal di PostgreSQL

Clear cache dulu:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan optimize:clear
```

Lalu ulang reset:

```powershell
php artisan migrate:fresh --seed
```

Kalau error tabel permission belum ada, pastikan migration Spatie ada:

```powershell
Get-ChildItem database\migrations | Select-String "permission"
```

Harus ada file seperti:

```text
*_create_permission_tables.php
*_seed_default_roles_and_permissions.php
```

Kalau error duplicate data, pakai reset total:

```powershell
php artisan migrate:fresh --seed
```

### 2B.7 Tes Login Setelah Seeder

Jalankan backend:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Di terminal lain, tes API login:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/login -Method Post -ContentType 'application/json' -Body '{"email":"admin@lms.test","password":"password"}'
```

Kalau sukses, response berisi:

```json
{
  "status": 200,
  "token": "...",
  "name": "Admin LMS",
  "role": "admin",
  "permissions": ["..."]
}
```


## 3. Setup Cepat Pakai Script

Cara termudah:

```powershell
.\scripts\setup.bat
```

Script ini akan:

- Menambahkan PHP 8.2 dan PostgreSQL ke `PATH` sementara.
- Membuat database `lms` kalau belum ada.
- Copy `backend/.env.example` ke `backend/.env` kalau belum ada.
- Copy `frontend/.env.example` ke `frontend/.env` kalau belum ada.
- Menjalankan `composer install`.
- Generate `APP_KEY` Laravel.
- Menjalankan `php artisan migrate --seed --force`.
- Menjalankan `npm install` di frontend.

Kalau script gagal karena path PHP/PostgreSQL berbeda, edit file:

```text
scripts/setup.ps1
scripts/run.ps1
```

Sesuaikan:

```powershell
$phpDirectory = 'C:\laragon\bin\php\php-8.2.29-nts-Win32-vs16-x64'
$postgresDirectory = 'C:\Program Files\PostgreSQL\17\bin'
```

## 4. Setup Manual Backend

Masuk folder backend:

```powershell
cd "D:\lms rachma\LMS\backend"
```

Install dependency:

```powershell
composer install
```

Kalau `composer install` memakai PHP salah, jalankan Composer lewat PHP 8.2 langsung:

```powershell
& "C:\laragon\bin\php\php-8.2.29-nts-Win32-vs16-x64\php.exe" "C:\laragon\bin\composer\composer.phar" install
```

Buat env:

```powershell
copy .env.example .env
```

Generate app key:

```powershell
php artisan key:generate
```

Pastikan konfigurasi database di `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5434
DB_DATABASE=lms
DB_USERNAME=postgres
DB_PASSWORD=
```

Buat database manual jika belum ada:

```powershell
createdb -h 127.0.0.1 -p 5434 -U postgres lms
```

Jalankan migration + seeder:

```powershell
php artisan migrate --seed
```

Kalau ingin reset database total lalu seed ulang:

```powershell
php artisan migrate:fresh --seed
```

## 5. Setup Manual Frontend

Masuk folder frontend:

```powershell
cd "D:\lms rachma\LMS\frontend"
```

Install dependency:

```powershell
npm install
```

Buat env:

```powershell
copy .env.example .env
```

Pastikan isi `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Kalau browser membuka backend sebagai `localhost`, boleh pakai:

```env
VITE_API_URL=http://localhost:8000/api
```

Yang penting backend benar-benar jalan di host dan port itu.

## 6. Menjalankan Project

Cara cepat:

```powershell
.\scripts\run.bat
```

Script ini menjalankan:

- Backend Laravel: `http://127.0.0.1:8000`
- Frontend Vite: `http://127.0.0.1:5173`
- Log runtime: `.runtime/`

Buka aplikasi:

```text
http://127.0.0.1:5173
```

## 7. Menjalankan Manual

Terminal 1, backend:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2, frontend:

```powershell
cd "D:\lms rachma\LMS\frontend"
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

## 8. Akun Seeder Default

Semua password akun seed default:

```text
password
```

Akun penting:

| Role | Email | Password | Keterangan |
|---|---|---|---|
| Admin | `admin@lms.test` | `password` | Mengatur role dan permission |
| Instructor | `instructor@lms.test` | `password` | Membuat course dan review submission |
| Student | `student@lms.test` | `password` | Akun demo student |
| Student | `andi@lms.test` | `password` | Akun student seeded |
| Student | `maya@lms.test` | `password` | Akun student seeded |

Panel admin:

```text
/account/admin/permissions
```

Admin bisa:

- Melihat semua role.
- Menambah permission baru.
- Mengatur permission untuk role `instructor` dan `student`.
- Mengubah role user.

Role `admin` selalu punya semua permission.

## 9. Fitur Permission

Project memakai package:

```text
spatie/laravel-permission
```

File penting:

```text
backend/config/permission.php
backend/database/migrations/*create_permission_tables.php
backend/database/migrations/*seed_default_roles_and_permissions.php
backend/app/Http/Controllers/Admin/RolePermissionController.php
backend/app/Models/User.php
```

Default permission:

```text
manage admin
manage roles
manage courses
review submissions
learn courses
```

Default role:

```text
admin
instructor
student
```

## 10. Upload File dan Storage

Project menyimpan upload course di:

```text
backend/public/uploads/course
backend/public/uploads/course/small
backend/public/uploads/course/videos
```

Pastikan folder bisa ditulis oleh Laravel.

Kalau pakai storage public Laravel di fitur lain, jalankan:

```powershell
php artisan storage:link
```

## 11. Command Harian

Backend test:

```powershell
cd backend
php artisan test
```

Frontend build:

```powershell
cd frontend
npm run build
```

Frontend lint:

```powershell
cd frontend
npm run lint
```

Clear Laravel cache:

```powershell
cd backend
php artisan optimize:clear
```

Lihat route API:

```powershell
cd backend
php artisan route:list
```

Lihat route admin:

```powershell
cd backend
php artisan route:list --path=admin
```

## 12. Troubleshooting

### Composer bilang PHP masih 8.1

Cek PHP aktif:

```powershell
where.exe php
php -v
```

Kalau yang muncul PHP 8.1, pakai PHP 8.2 langsung:

```powershell
& "C:\laragon\bin\php\php-8.2.29-nts-Win32-vs16-x64\php.exe" "C:\laragon\bin\composer\composer.phar" install
```

Atau ubah PATH Windows/Laragon supaya PHP 8.2 menjadi default.

### Login 401

Pastikan email dan password benar:

```text
admin@lms.test / password
andi@lms.test / password
student@lms.test / password
```

Cek user di database:

```powershell
cd backend
php artisan tinker
```

Lalu:

```php
App\Models\User::select('id','name','email','role')->get();
```

Kalau user seed belum ada:

```powershell
php artisan migrate:fresh --seed
```

### Sudah login tapi halaman dalam error 401

Hapus token lama di browser:

```js
localStorage.removeItem('userInfoLms')
```

Lalu login ulang.

Pastikan `frontend/.env` sama dengan backend aktif:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### API 500 Internal Server Error

Cek log Laravel:

```powershell
Get-Content backend\storage\logs\laravel.log -Tail 120
```

Clear cache:

```powershell
cd backend
php artisan optimize:clear
```

### Database tidak konek

Cek PostgreSQL aktif dan port benar:

```powershell
psql -h 127.0.0.1 -p 5434 -U postgres -d postgres
```

Kalau port PostgreSQL kamu `5432`, ubah `backend/.env` dan `scripts/setup.ps1`:

```env
DB_PORT=5432
```

### Frontend tidak terhubung backend

Cek backend:

```text
http://127.0.0.1:8000/api/fetch-courses
```

Cek env frontend:

```text
frontend/.env
```

Set:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Restart Vite setelah ubah `.env`.

### Port sudah dipakai

Cek port:

```powershell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 8000,5173 }
```

Matikan proses lama atau ubah port di `scripts/run.ps1`.

## 13. Alur Setup Bersih dari Nol

Kalau ingin mulai ulang total:

```powershell
cd "D:\lms rachma\LMS\backend"
php artisan migrate:fresh --seed
php artisan optimize:clear

cd "D:\lms rachma\LMS\frontend"
npm install
npm run build
```

Lalu jalankan:

```powershell
cd "D:\lms rachma\LMS"
.\scripts\run.bat
```

Buka:

```text
http://127.0.0.1:5173
```

Login admin:

```text
admin@lms.test
password
```

## 14. Catatan Penting untuk Developer

- Jangan commit file `.env`.
- Jangan hapus `composer.lock` dan `package-lock.json` tanpa alasan.
- Setelah ubah `.env`, restart server.
- Setelah ubah migration/seeder, jalankan `php artisan migrate:fresh --seed` kalau data boleh direset.
- Setelah ubah frontend, jalankan `npm run build`.
- Setelah ubah backend, jalankan `php artisan test`.
