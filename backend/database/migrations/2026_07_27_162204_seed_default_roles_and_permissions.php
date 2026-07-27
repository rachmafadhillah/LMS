<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $roles = ['admin', 'instructor', 'student'];
        $permissions = ['manage admin', 'manage roles', 'manage courses', 'review submissions', 'learn courses'];

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

        DB::table('users')->orderBy('id')->chunkById(100, function ($users) use ($roleIds) {
            foreach ($users as $user) {
                $role = in_array($user->role, ['admin', 'instructor', 'student']) ? $user->role : 'student';
                DB::table('model_has_roles')->updateOrInsert([
                    'role_id' => $roleIds[$role],
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $user->id,
                ]);
            }
        });
    }

    public function down(): void
    {
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('permissions')->whereIn('name', ['manage admin', 'manage roles', 'manage courses', 'review submissions', 'learn courses'])->delete();
        DB::table('roles')->whereIn('name', ['admin', 'instructor', 'student'])->delete();
    }
};
