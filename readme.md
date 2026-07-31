# 🛡️ Ayola Guard Absence (GuardWebAbsence)

<p align="center">
  <img alt="Ayola Guard Absence Logo" src="public/icons/icon-192x192.png" width="120" style="border-radius: 20%;">
  <h3 align="center">Sistem Absensi & Patroli Satpam Berbasis Progressive Web App (PWA)</h3>
</p>

<p align="center">
  <a href="https://github.com/ghossanammarsantos/ayolaguardabsence"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub"></a>
  <a href="https://gitlab.com/ghossan/ayolaguardabsence"><img src="https://img.shields.io/badge/GitLab-Repository-FC6D26?style=flat-square&logo=gitlab" alt="GitLab"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js" alt="Next.js"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://web.dev/progressive-web-apps/"><img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa" alt="PWA Ready"></a>
</p>

---

## 📌 Deskripsi Project

**Ayola Guard Absence** adalah aplikasi web modern berbasis Progressive Web App (PWA) yang dirancang khusus untuk mengelola, memantau, dan mencatat kegiatan patroli serta absensi petugas keamanan (satpam) secara *real-time*.

Aplikasi ini memudahkan satpam dalam melakukan verifikasi kehadiran di setiap titik *checkpoint* keamanan dengan memindai Kode QR, mengambil foto swafoto (*selfie*), serta mendokumentasikan koordinat lokasi GPS secara akurat.

---

## ✨ Fitur-Fitur Utama

### 👮 Portal Petugas Keamanan (Satpam)
- 🔐 **Autentikasi Satpam**: Login mandiri menggunakan ID Satpam & PIN.
- 📷 **Scan QR Code Patroli**: Pemindaian kode QR di setiap titik patroli menggunakan kamera smartphone secara cepat.
- 🤳 **Verifikasi Selfie & GPS**: Pengambilan foto swafoto bukti kehadiran beserta lokasi peta interaktif.
- 📊 **Progres Patroli Harian**: Indikator persentase penyelesaian titik lokasi patroli per *shift*.
- 📋 **Riwayat & Laporan Kejadian**: Pencatatan riwayat absensi serta pelaporan temuan/insiden di lapangan secara langsung.

### 👨‍💼 Portal Admin & Supervisor
- 📈 **Dashboard Pemantauan**: Ringkasan status patroli harian, performa anggota satpam, dan statistik kehadiran.
- 🖨️ **Generator & Cetak QR Code**: Pembuatan dan pencetakan kode QR untuk diletakkan pada titik-titik pos lokasi (Pos Utama, Lobby, Parkiran, Ruang Server, dll.).
- 📄 **Ekspor Laporan PDF & Excel**: Unduh rekapitulasi data absensi dan laporan patroli bulanan dalam format siap cetak.

### 📱 Pengalaman Pengguna (PWA & UI)
- 🚀 **Progressive Web App (PWA)**: Dapat di-install langsung di HP Android/iOS serasa aplikasi native tanpa perlu Play Store/App Store.
- 🌙 **Dark Mode & Light Mode**: Tampilan UI responsif dengan skema warna modern yang nyaman digunakan di malam hari.
- 📴 **Dukungan Offline**: Cache otomatis untuk memastikan aplikasi tetap responsif saat sinyal lemah.

---

## 🛠️ Spesifikasi Teknologi (Tech Stack)

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (Pages Router)
- **UI Library & Icon**: React 18, Tailwind CSS, Heroicons / Custom SVG
- **PWA & Offline Capability**: `next-pwa`, Service Worker
- **Peta Interaktif**: Leaflet.js & React-Leaflet
- **Pemindai QR**: `html5-qrcode` & `jsqr`
- **Ekspor Dokumen**: `jspdf`, `jspdf-autotable`, `xlsx`
- **Backend API (Opsional)**: Laravel PHP API / LocalStorage Hybrid

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat System
- [Node.js](https://nodejs.org/) v18.x atau lebih baru
- `npm` atau `pnpm`

### 2. Instalasi & Import Project

```bash
# Clone repository ini
git clone https://github.com/ghossanammarsantos/ayolaguardabsence.git

# Masuk ke direktori project
cd ayolaguardabsence

# Install dependency
npm install
```

### 3. Jalankan Mode Pengembang (Development)

```bash
npm run dev
```
Buka halaman di browser Anda pada alamat: **[http://localhost:3000](http://localhost:3000)**

### 4. Build untuk Production

```bash
npm run build
npm run start
```

---

## 🌐 Deployment & Hosting (Vercel)

Aplikasi ini sudah dioptimalkan dan siap di-deploy dalam 1-klik ke **Vercel**:

1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Import repository **`ghossanammarsantos/ayolaguardabsence`** (atau dari GitLab `ghossan/ayolaguardabsence`).
3. Klik **Deploy**.

---

## 📄 Lisensi & Kontributor

- **Project**: Ayola Guard Absence
- **Developer**: Ghossan Ammar Santos
- **Lisensi**: MIT License
