<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Patrol Points Table
        Schema::create('patrol_points', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. QR-LOBBY-01
            $table->string('name'); // e.g. Lobby Utama
            $table->string('area'); // e.g. Front Office
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('allowed_radius_meters')->default(50);
            $table->time('schedule_time_start')->default('08:00');
            $table->time('schedule_time_end')->default('20:00');
            $table->text('instructions')->nullable();
            $table->string('image_sample_url')->nullable();
            $table->timestamps();
        });

        // 2. Patrol Logs Table
        Schema::create('patrol_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guard_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('patrol_point_id')->constrained('patrol_points')->onDelete('cascade');
            $table->dateTime('scanned_at');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('distance_meters')->nullable();
            $table->string('photo_path');
            $table->enum('status', ['berhasil', 'terlambat', 'invalid_location'])->default('berhasil');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patrol_logs');
        Schema::dropIfExists('patrol_points');
    }
};
