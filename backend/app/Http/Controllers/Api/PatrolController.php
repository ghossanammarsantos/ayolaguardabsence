<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatrolPoint;
use App\Models\PatrolLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class PatrolController extends Controller
{
    /**
     * Verify QR Code Token scanned by Guard
     */
    public function verifyQrCode(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $point = PatrolPoint::where('code', $request->qr_code)->first();

        if (!$point) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code titik patroli tidak ditemukan atau tidak valid.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $point->id,
                'code' => $point->code,
                'name' => $point->name,
                'area' => $point->area,
                'schedule_start' => $point->schedule_time_start,
                'schedule_end' => $point->schedule_time_end,
                'instructions' => $point->instructions,
                'latitude' => (float)$point->latitude,
                'longitude' => (float)$point->longitude,
                'allowed_radius_meters' => $point->allowed_radius_meters,
            ]
        ]);
    }

    /**
     * Submit Patrol Attendance (Multipart: QR Code, Selfie Image File, GPS Lat/Lng)
     */
    public function submitPatrol(Request $request)
    {
        $request->validate([
            'patrol_point_id' => 'required|exists:patrol_points,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $user = $request->user();
        $point = PatrolPoint::findOrFail($request->patrol_point_id);

        // Upload Selfie Photo
        $photoPath = $request->file('photo')->store('patrol-selfies', 'public');
        $photoUrl = Storage::url($photoPath);

        // Calculate Geofence Distance (Haversine Formula)
        $distanceMeters = $this->calculateDistanceMeters(
            $request->latitude,
            $request->longitude,
            $point->latitude,
            $point->longitude
        );

        // Determine Status
        $now = Carbon::now();
        $status = 'berhasil';

        if ($distanceMeters > $point->allowed_radius_meters) {
            $status = 'invalid_location';
        }

        // Create Log
        $log = PatrolLog::create([
            'guard_id' => $user->id,
            'patrol_point_id' => $point->id,
            'scanned_at' => $now,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'distance_meters' => round($distanceMeters),
            'photo_path' => $photoUrl,
            'status' => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen patroli berhasil dicatat!',
            'data' => [
                'log_id' => $log->id,
                'point_name' => $point->name,
                'area' => $point->area,
                'scanned_at' => $now->format('d M Y H:i:s') . ' WIB',
                'latitude' => $log->latitude,
                'longitude' => $log->longitude,
                'photo_url' => $photoUrl,
                'status' => $status,
                'distance_meters' => round($distanceMeters),
            ]
        ], 201);
    }

    /**
     * Haversine Distance Formula in Meters
     */
    private function calculateDistanceMeters($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Earth radius in meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
