<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PatrolPoint;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Guards & Admin Users
        User::create([
            'name' => 'Budi Santoso',
            'guard_id' => 'SATPAM01',
            'username' => 'SATPAM01',
            'phone' => '+62 812-3456-7890',
            'role' => 'guard',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
            'password' => Hash::make('123456'),
        ]);

        User::create([
            'name' => 'Admin Security Ayola',
            'guard_id' => 'ADMIN01',
            'username' => 'admin',
            'phone' => '+62 811-9999-8888',
            'role' => 'admin',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            'password' => Hash::make('admin123'),
        ]);

        // 2. Seed Initial Patrol Points (Exact LAND GPS Coordinates for Coastarina Ocarina Peninsula)
        $points = [
            [
                'code' => 'QR-LOBBY-01',
                'name' => 'Lobby Utama Ocarina',
                'area' => 'Gerbang Masuk Semenanjung Ocarina',
                'latitude' => 1.153200,
                'longitude' => 104.052800,
                'allowed_radius_meters' => 50,
                'schedule_time_start' => '08:00',
                'schedule_time_end' => '20:00',
                'instructions' => 'Pastikan area gerbang utama Ocarina Batam aman dan kondusif.',
                'image_sample_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'code' => 'QR-KOLAM-02',
                'name' => 'Waterpark Ocarina',
                'area' => 'Pusat Wahana Waterpark Ocarina',
                'latitude' => 1.154500,
                'longitude' => 104.054500,
                'allowed_radius_meters' => 50,
                'schedule_time_start' => '08:00',
                'schedule_time_end' => '20:00',
                'instructions' => 'Periksa kedalaman air, pagar pembatas, & kebersihan area kolam.',
                'image_sample_url' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'code' => 'QR-PANTAI-03',
                'name' => 'Area Pantai Coastarina',
                'area' => 'Plaza Bianglala & Pesisir Timur',
                'latitude' => 1.155200,
                'longitude' => 104.056500,
                'allowed_radius_meters' => 75,
                'schedule_time_start' => '08:00',
                'schedule_time_end' => '20:00',
                'instructions' => 'Pantau garis pantai Ocarina Batam dan penerangan malam.',
                'image_sample_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'code' => 'QR-PARKIR-04',
                'name' => 'Area Parkir Utama',
                'area' => 'Parkiran Kendaraan Utama Visitor',
                'latitude' => 1.152500,
                'longitude' => 104.053800,
                'allowed_radius_meters' => 50,
                'schedule_time_start' => '08:00',
                'schedule_time_end' => '20:00',
                'instructions' => 'Pastikan kendaraan pengunjung terkunci rapat & cek CCTV.',
                'image_sample_url' => 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'code' => 'QR-BOH-05',
                'name' => 'Back of House',
                'area' => 'Service & Ruang Genset Utara',
                'latitude' => 1.156000,
                'longitude' => 104.054800,
                'allowed_radius_meters' => 50,
                'schedule_time_start' => '08:00',
                'schedule_time_end' => '20:00',
                'instructions' => 'Periksa panel listrik utama, genset, dan pintu darurat.',
                'image_sample_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
            ],
        ];

        foreach ($points as $p) {
            PatrolPoint::create($p);
        }
    }
}
