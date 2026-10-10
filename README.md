# Website Resmi Kelurahan Tinoor Satu (Kecamatan Tomohon Utara, Kota Tomohon)

Website profil & informasi digital Kelurahan Tinoor Satu, terinspirasi penuh dari standar Kelurahanin modern portal Kelurahan (Kersik / DIGIDES) menggunakan palet warna khas hijau mantine, tipografi Google Fonts **Outfit**, layout responsif, dan siap dideploy secara statis & gratis ke **Cloudflare Pages**.

---

## 🚀 Fitur & Halaman Website

1. **Halaman Home (`index.html`)**:
   - Header resmi Pemerintah Kelurahan Tinoor Satu lengkap dengan lambang Kota Tomohon.
   - Menu navigasi bersih: **Home**, **Profil Kelurahan**, **Infografis** (bagian yang tidak relevan seperti APBDes, Berita, Belanja, PPID, IDM telah ditiadakan sesuai permintaan).
   - Hero Slider Banner interaktif (Panorama Alam Tinoor & Teluk Manado/Bunaken, Kantor Kelurahan Pelayanan, dan Air Terjun Tekaan Telu) dilengkapi kontrol tombol & navigasi touch-swipe.
   - Tombol Aksi Cepat / Jelajahi Kelurahan (Profil, Infografis, SOTK, Potensi).
   - Sambutan resmi Kepala Kelurahan / Lurah Tinoor Satu (Bpk. Hendrik Mamahit, S.P).
   - Bagan Ringkasan SOTK Perangkat Kelurahan dengan modal detail tupoksi interaktif.
   - Ringkasan kartu statistik demografi penduduk.
   - Peta Interaktif OpenStreetMap (Leaflet) lokasi Kelurahan Tinoor Satu & koordinat kantor Kelurahan.
   - Potensi & Daya Tarik Kelurahan (Panorama Puncak Tinoor, Ekowisata Tekaan Telu, Wisata Kuliner Tebing, Pisang Mas Tinoor).
   - Galeri Dokumentasi Kelurahan dengan Lightbox Zoom.
   - **Floating Widgets**:
     - *Kunjungan Hari Ini* (kiri bawah) dengan popup dropdown statistik lengkap pengunjung.
     - *Fitur Aksesibilitas* (kanan bawah) untuk mengatur ukuran teks dan kontras tinggi.
     - *Pengaduan Warga* (kanan bawah) terhubung ke WhatsApp pelayanan dan form online.

2. **Halaman Profil Kelurahan (`profil.html`)**:
   - Visi & Misi pembangunan Kelurahan berlandaskan falsafah *Mapalus* dan *Si Tou Timou Tumou Tou*.
   - Sejarah asal-usul Kelurahan Tinoor Satu & pemekaran 22 Februari 1985.
   - Bagan Lengkap Struktur Organisasi dan Tata Kerja (SOTK) Aparatur Kelurahan & 5 Kepala Lingkungan (Pala).
   - Kondisi Geografis, Topografi lereng Gunung Lokon, Luas wilayah (1,85 km²), dan 4 Batas Wilayah mata angin (Utara, Timur, Selatan, Barat).
   - Peta lokasi kantor Kelurahan.

3. **Halaman Infografis Demografi Penduduk (`infografis.html`)**:
   - **Sesuai 100% dengan Screenshot 2**:
     - Judul **DEMOGRAFI PENDUDUK** dengan ilustrasi 3D tablet & piramida.
     - Subjudul **Jumlah Penduduk dan Kepala Keluarga**.
     - 4 Kartu Statistik dengan aset avatar identik:
       - **TOTAL PENDUDUK**: 1.842 Jiwa
       - **KEPALA KELUARGA**: 524 Jiwa
       - **PEREMPUAN**: 912 Jiwa
       - **LAKI-LAKI**: 930 Jiwa
   - Grafik interaktif Chart.js:
     - Piramida / Distribusi Kelompok Umur (Laki-laki vs Perempuan).
     - Sebaran Penduduk per Lingkungan (Lingkungan I s/d V).
     - Tingkat Pendidikan Terakhir Warga.
     - Mata Pencaharian / Pekerjaan Utama Warga.
     - Komposisi Pemeluk Agama.
     - Status Perkawinan Warga.
     - Data Hak Wajib Pilih (DPT).

---

## 🛠️ Menjalankan Proyek Secara Lokal

Pastikan Anda telah menginstal **Node.js** (v18+ disarankan):

```bash
# 1. Masuk ke direktori proyek
cd tinoor1kkt

# 2. Jalankan server pengembangan lokal (Vite)
npm run dev
```

Buka browser Anda di `http://localhost:5173`.

---

## 📦 Build Produksi Statis

Untuk menghasilkan bundle file statis HTML, CSS, dan JavaScript yang sudah teroptimasi:

```bash
npm run build
```

Hasil build akan tersimpan di dalam folder `dist/`.

Anda dapat menguji hasil build sebelum deploy dengan:
```bash
npm run preview
```

---

## ☁️ Panduan Deploy Gratis ke Cloudflare Pages

### Cara 1: Menggunakan Git Repository (Otomatis & Direkomendasikan)
1. Push folder proyek ini ke repositori **GitHub** atau **GitLab** Anda.
2. Buka dashboard [Cloudflare Pages](https://dash.cloudflare.com/) > Masuk ke menu **Workers & Pages**.
3. Klik **Create application** > Pilih tab **Pages** > **Connect to Git**.
4. Pilih repositori proyek Anda.
5. Pada bagian **Build settings**:
   - **Framework preset**: `Vite` (atau `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Klik **Save and Deploy**. Website Kelurahan Tinoor Satu Anda langsung online dengan domain gratis `*.pages.dev` lengkap dengan SSL HTTPS gratis dan CDN global super cepat!

### Cara 2: Direct Upload (Tanpa Git)
1. Jalankan perintah `npm run build`.
2. Buka Cloudflare Dashboard > **Workers & Pages** > **Create application** > **Pages** > **Upload assets**.
3. Beri nama proyek (misal: `tinoor-satu`).
4. Tarik dan lepas (drag & drop) folder `dist` ke halaman Cloudflare.
5. Klik **Deploy site**.

---

## 📁 Struktur Direktori

```text
tinoor1kkt/
├── index.html              # Halaman Utama (Home)
├── profil.html             # Halaman Profil Kelurahan & SOTK
├── infografis.html         # Halaman Infografis Demografi Penduduk
├── package.json            # Konfigurasi dependensi Node.js & Vite
├── vite.config.js          # Konfigurasi build multi-page HTML
├── public/                 # Aset statis publik
│   └── assets/
│       ├── images/         # Foto Kelurahan, avatar penduduk, ilustrasi 3D, lambang
│       └── icons/          # Ikon SVG navigasi
└── src/
    ├── css/                # Modular Vanilla CSS
    │   ├── variables.css   # Variabel warna hijau & token Kelurahanin
    │   ├── global.css      # Reset dan komponen umum
    │   ├── navbar.css      # Header & mobile drawer
    │   ├── hero.css        # Carousel banner
    │   ├── floating-widgets.css # Widget kunjungan, aksesibilitas, pengaduan
    │   ├── sections.css    # Jelajahi, Sambutan, SOTK, Peta, Potensi, Galeri
    │   ├── infografis.css  # Styling kartu demografi & grafik
    │   ├── footer.css      # Footer kersik style
    │   └── main.css        # Master stylesheet
    └── js/
        ├── main.js         # Entry point aplikasi
        ├── carousel.js     # Logika slider banner
        ├── widgets.js      # Logika widget floating & modal
        ├── map.js          # Peta Leaflet Tinoor Satu
        └── charts.js       # Logika grafik Chart.js
```
