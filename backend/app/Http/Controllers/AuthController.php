<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {
        $v = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:client,admin',
        ]);

        $user = User::create([...$v, 'password' => Hash::make($v['password'])]);
        return response()->json(['user' => $user, 'token' => $user->createToken('at')->plainTextToken], 201);
    }

    public function login(Request $request) {
        $v = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        $user = User::whereRaw('LOWER(email) = ?', [strtolower($v['email'])])->first();

        if (!$user || !Hash::check($v['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['user' => $user, 'token' => $user->createToken('at')->plainTextToken]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function index() { return response()->json(User::all()); }
    public function getDeletedUsers() { return response()->json(User::onlyTrashed()->get()); }

    public function deleteUser($id) {
        $user = User::find($id);
        if (!$user || $user->id === auth()->id()) return response()->json(['message' => 'Action forbidden'], 403);
        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function restoreUser($id) {
        $user = User::withTrashed()->find($id);
        if (!$user) return response()->json(['message' => 'Not found'], 404);
        $user->restore();
        return response()->json(['message' => 'Restored', 'user' => $user]);
    }

    public function forceDeleteUser($id) {
        $user = User::withTrashed()->find($id);
        if ($user) $user->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }
}
