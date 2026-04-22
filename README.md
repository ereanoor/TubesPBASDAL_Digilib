#  DigiLib - Sistem Informasi Perpustakaan Digital

DigiLib adalah aplikasi sistem informasi perpustakaan digital berbasis web yang dikembangkan sebagai bagian dari pemenuhan Tugas Besar Praktikum Basis Data Lanjut (PBASDAL). Sistem ini dirancang untuk mendigitalkan proses operasional perpustakaan, mulai dari manajemen pengguna, sirkulasi literatur, hingga pelaporan analitik berbasis data.

##  Fitur Utama

## Fitur Utama

### Autentikasi & Keamanan
* **Registrasi Anggota Baru:** Calon pengguna dapat mendaftarkan akun secara mandiri melalui antarmuka pendaftaran yang terintegrasi langsung dengan basis data.
* **Sistem Login Berbasis Peran (Role-Based Access):** Mekanisme login cerdas yang secara otomatis membedakan hak akses dan mengarahkan pengguna ke *dashboard* **Super Admin** atau **Anggota** berdasarkan status peran di *database*.

Sistem ini memisahkan hak akses menjadi dua peran utama (*Role-Based Access Control*):

### 1. Super Admin
* **Dashboard Analitik:** Menyajikan ringkasan data real-time dan visualisasi grafik aktivitas peminjaman.
* **Manajemen Bibliografi:** Mengelola data buku (CRUD) beserta sampul (*cover*) buku.
* **Manajemen Sirkulasi:** Memantau riwayat peminjaman dan memvalidasi pengembalian buku (ACC Kembali).
* **Manajemen Keanggotaan:** Mengelola dan memantau status akun anggota perpustakaan terdaftar.

### 2. Anggota (User)
* **Katalog Buku:** Menjelajahi daftar koleksi buku yang tersedia di perpustakaan.
* **Riwayat Peminjaman:** Melihat status sirkulasi buku yang sedang dipinjam maupun yang sudah dikembalikan.
* **Sistem Rating & Ulasan:** Memberikan umpan balik (1-5 bintang) untuk buku yang telah selesai dipinjam (dilengkapi dengan validasi *client-side* dan *database constraint*).

##  Teknologi yang Digunakan

* **Frontend:** HTML5, CSS3, Vanilla JavaScript, JSON (Fetch API)
* **Backend:** PHP (Native/API-based)
* **Database:** MySQL
* **Koneksi Database:** PDO (PHP Data Objects)

## Anggota Kelompok & Jobdesk

Proyek **DigiLib** ini dikembangkan secara kolaboratif oleh:

| **Tri Haiji Januarli** | G1A024069 | Penyusunan Laporan |

| **R. Noor Fikhri** | G1A024075 | Project (Development) & Penyusunan Laporan |

| **Ikhsan Rihan Farli** | G1A024083 | Pembuatan Presentasi (PPT) |

---
*Dibuat untuk pemenuhan Tugas Besar Praktikum Basis Data Lanjut (PBASDAL) - Universitas Bengkulu.*
