<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to the social provider
     *
     * @param string $provider
     * @return \Illuminate\Http\JsonResponse
     */
    public function redirectToProvider($provider)
    {
        if ($provider !== 'google') {
            return response()->json(['message' => 'Provider not supported'], 400);
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle provider callback
     *
     * @param string $provider
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleProviderCallback($provider)
    {
        if ($provider !== 'google') {
            return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . "/login?error=Provider not supported");
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            $user = User::where($provider . '_id', $socialUser->getId())
                ->orWhere('email', $socialUser->getEmail())
                ->first();

            if ($user) {
                // Link account if not already linked
                if (!$user->{$provider . '_id'}) {
                    $user->update([
                        $provider . '_id' => $socialUser->getId(),
                        'avatar' => $user->avatar ?? $socialUser->getAvatar(),
                    ]);
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                    'email' => $socialUser->getEmail(),
                    $provider . '_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'role' => 'client', // Default role for social logins
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $userData = urlencode(json_encode($user));

            // Redirect back to frontend
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect()->away($frontendUrl . "/auth/callback?token={$token}&user={$userData}");

        } catch (Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect()->away($frontendUrl . "/login?error=" . urlencode("Failed to authenticate with " . ucfirst($provider)));
        }
    }
}
