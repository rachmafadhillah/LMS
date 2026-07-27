<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    private array $defaultRoles = ['admin', 'instructor', 'student'];

    private array $defaultPermissions = [
        'manage admin',
        'manage roles',
        'manage courses',
        'review submissions',
        'learn courses',
    ];

    public function index()
    {
        $this->ensureDefaults();

        return response()->json([
            'status' => 200,
            'roles' => Role::with('permissions')->orderBy('name')->get(),
            'permissions' => Permission::orderBy('name')->get(),
            'users' => User::with('roles.permissions')->orderBy('name')->get(['id', 'name', 'email', 'role']),
        ], 200);
    }

    public function updateRolePermissions(Request $request, Role $role)
    {
        if ($role->name === 'admin') {
            return response()->json([
                'status' => 400,
                'message' => 'Admin role permissions cannot be changed.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $role->syncPermissions($request->input('permissions', []));

        return response()->json([
            'status' => 200,
            'message' => 'Role permissions updated successfully.',
            'role' => $role->load('permissions'),
        ], 200);
    }

    public function updateUserRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $role = $request->input('role');
        $user->syncRoles([$role]);
        $user->role = $role;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'User role updated successfully.',
            'user' => $user->load('roles.permissions'),
        ], 200);
    }

    public function storePermission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        $permission = Permission::create(['name' => $request->name, 'guard_name' => 'web']);

        return response()->json([
            'status' => 200,
            'message' => 'Permission created successfully.',
            'permission' => $permission,
        ], 200);
    }

    private function ensureDefaults(): void
    {
        foreach ($this->defaultPermissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        foreach ($this->defaultRoles as $roleName) {
            Role::findOrCreate($roleName, 'web');
        }

        Role::findByName('admin', 'web')->syncPermissions(Permission::all());
        Role::findByName('instructor', 'web')->givePermissionTo(['manage courses', 'review submissions', 'learn courses']);
        Role::findByName('student', 'web')->givePermissionTo(['learn courses']);
    }
}
