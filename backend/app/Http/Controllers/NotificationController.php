<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) return response()->json(['data' => []]);
            
            $notifications = $user->notifications()->paginate(20);
            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['data' => [], 'message' => 'Notification registry currently offline']);
        }
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
