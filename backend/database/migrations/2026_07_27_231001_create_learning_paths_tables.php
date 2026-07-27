<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_paths', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('career_goal')->nullable();
            $table->integer('estimated_hours')->default(0);
            $table->integer('sort_order')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
        });

        Schema::create('learning_path_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_path_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['learning_path_id', 'course_id']);
            $table->index(['learning_path_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_courses');
        Schema::dropIfExists('learning_paths');
    }
};
