<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Default dari laravel
    // Jalankan migrasi (membuat tabel)
    public function up(): void
    {
        // Tabel Users
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // ID utama (Primary Key)
            $table->string('name'); // Nama pengguna
            $table->string('email')->unique(); // Email unik (tidak boleh kembar)
            $table->timestamp('email_verified_at')->nullable(); // Waktu verifikasi email
            $table->string('password'); // Password (terenkripsi)
            $table->rememberToken(); // Token untuk fitur 'Remember Me'
            $table->timestamps(); // Kolom created_at & updated_at
        });

        // Tabel Token Reset Password
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email sebagai kunci utama
            $table->string('token'); // Token reset password
            $table->timestamp('created_at')->nullable(); // Waktu token dibuat
        });

        // Tabel Sesi Pengguna
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID unik session
            $table->foreignId('user_id')->nullable()->index(); // ID user yang login
            $table->string('ip_address', 45)->nullable(); // Alamat IP user
            $table->text('user_agent')->nullable(); // Info browser/perangkat
            $table->longText('payload'); // Data utama session
            $table->integer('last_activity')->index(); // Waktu aktivitas terakhir
        });
    }

    // Batalkan migrasi (menghapus tabel)
    public function down(): void
    {
        Schema::dropIfExists('users'); // Hapus tabel users
        Schema::dropIfExists('password_reset_tokens'); // Hapus tabel token
        Schema::dropIfExists('sessions'); // Hapus tabel sessions
    }
};