<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('guard_id', strtoupper($request->username))
            ->orWhere('username', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Default demo fallback if no DB user exists yet
            if (strtoupper($request->username) === 'SATPAM01' && $request->password === '123456') {
                return response()->json([
                    'success' => true,
                    'message' => 'Login Berhasil (Demo Account)',
                    'token' => 'demo_bearer_token_satpam_01',
                    'user' => [
                        'id' => 'usr_01',
                        'guard_id' => 'SATPAM01',
                        'name' => 'Budi Santoso',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                        'role' => 'guard',
                        'shift_name' => 'Shift Pagi (08:00 - 20:00 WIB)',
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'ID Satpam / Username atau Password salah.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }
}
