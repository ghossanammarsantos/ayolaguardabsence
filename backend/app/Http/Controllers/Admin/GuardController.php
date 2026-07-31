<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class GuardController extends Controller
{
    /**
     * Get all Guards
     */
    public function index()
    {
        $guards = User::where('role', 'guard')->orderBy('guard_id', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $guards
        ]);
    }

    /**
     * Store a new Guard user
     */
    public function store(Request $request)
    {
        $request->validate([
            'guard_id' => 'required|string|unique:users,guard_id',
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        $guard = User::create([
            'name' => $request->name,
            'guard_id' => strtoupper($request->guard_id),
            'username' => strtoupper($request->guard_id),
            'phone' => $request->phone,
            'role' => 'guard',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun Satpam berhasil dibuat!',
            'data' => $guard
        ], 201);
    }

    /**
     * Delete a Guard user
     */
    public function destroy($id)
    {
        $guard = User::where('role', 'guard')->where('id', $id)->firstOrFail();
        $guard->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun Satpam berhasil dihapus.'
        ]);
    }
}
