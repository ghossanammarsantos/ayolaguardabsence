# AYOLA OCARINA - Laravel Backend API & Admin Portal

Sistem Backend & REST API untuk Aplikasi Absensi & Patroli QR Satpam **AYOLA OCARINA**.

## Fitur Utama Backend:
1. **Autentikasi API (Laravel Sanctum)**: Keamanan login Satpam & Admin via Token.
2. **Scanner & Verification Endpoint**: Memvalidasi token QR Code dan koordinat GPS.
3. **Validasi Geofencing (Haversine Formula)**: Menghitung jarak presisi antara koordinat perangkat Satpam dan koordinat terdaftar titik QR (Max radius e.g. 50 meter).
4. **Selfie Image Storage**: Menyimpan foto bukti selfie ke storage server dengan kompresi & watermark.
5. **Dashboard Monitoring Admin**: Data statistik harian, audit log foto, peta interaktif real-time, & export laporan (PDF / Excel).

---

## Cara Instalasi & Setup Backend Laravel

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
composer install

# 3. Copy file environment
cp .env.example .env

# 4. Generate Application Key
php artisan key:generate

# 5. Konfigurasi Database di file .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ayola_patrol_db
DB_USERNAME=root
DB_PASSWORD=

# 6. Jalankan Migrasi & Database Seeder
php artisan migrate --seed

# 7. Simbolis Link Storage untuk foto selfie
php artisan storage:link

# 8. Jalankan Local Server Laravel
php artisan serve --port=8000
```

Backend API akan berjalan di: `http://localhost:8000/api/v1/`
