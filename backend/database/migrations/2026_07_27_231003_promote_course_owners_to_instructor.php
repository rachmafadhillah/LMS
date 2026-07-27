<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $ownerIds = DB::table('courses')->distinct()->pluck('user_id');

        if ($ownerIds->isNotEmpty()) {
            DB::table('users')
                ->whereIn('id', $ownerIds)
                ->update(['role' => 'instructor']);
        }
    }

    public function down(): void
    {
        $ownerIds = DB::table('courses')->distinct()->pluck('user_id');

        if ($ownerIds->isNotEmpty()) {
            DB::table('users')
                ->whereIn('id', $ownerIds)
                ->where('role', 'instructor')
                ->update(['role' => 'student']);
        }
    }
};
