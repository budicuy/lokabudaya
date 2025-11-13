# Fitur Pencarian Tempat Wisata

## Ringkasan
Aplikasi Loka Budaya kini dilengkapi dengan fitur pencarian tempat wisata yang dinamis menggunakan Mapbox Geocoding API. Fitur ini memungkinkan pengguna untuk mencari berbagai destinasi wisata di Indonesia, khususnya di Jakarta.

## Fitur Utama

### 1. Pencarian Dinamis dengan API
- **Integrasi Mapbox Geocoding API**: Menggunakan API Mapbox untuk mendapatkan data tempat wisata secara real-time
- **Multi-query Search**: Melakukan pencarian dengan beberapa variasi query untuk hasil yang lebih komprehensif:
  - Query asli dari pengguna
  - "wisata [query]" untuk fokus pada destinasi wisata
  - "tempat wisata [query]" untuk hasil yang lebih spesifik
- **Filter POI**: Khusus mencari Points of Interest (POI) untuk fokus pada tempat-tempat wisata

### 2. Kategorisasi Tempat Wisata
Sistem mengenali dan mengkategorikan tempat wisata ke dalam:
- **Museum**: Museum dan galeri seni
- **Monumen**: Monumen, tugu, dan landmark bersejarah
- **Taman**: Taman kota, taman wisata, dan kebun
- **Tempat Ibadah**: Masjid, gereja, candi, dan pura yang menjadi objek wisata
- **Istana**: Istana dan keraton
- **Pantai**: Pantai dan area pesisir
- **Pusat Belanja**: Mall dan plaza
- **Tempat Wisata**: Destinasi wisata lainnya
- **Kawasan**: Area wisata yang lebih luas

### 3. Filter dan Pencarian
- **Filter Kategori**: Pengguna dapat memfilter hasil pencarian berdasarkan kategori
- **Debounced Search**: Pencarian otomatis dengan delay 500ms untuk mengurangi API calls
- **Loading States**: Indikator loading saat melakukan pencarian
- **Empty State**: Pesan yang informatif saat tidak ada hasil

### 4. Data Default
Aplikasi memuat 15 destinasi wisata populer di Jakarta secara default:
1. Monumen Nasional Jakarta
2. Museum Nasional Jakarta
3. Taman Mini Indonesia Indah
4. Kota Tua Jakarta
5. Ancol Jakarta Bay City
6. Taman Impian Jaya Ancol
7. Masjid Istiqlal Jakarta
8. Gereja Katedral Jakarta
9. Museum Fatahillah Jakarta
10. Istana Merdeka Jakarta
11. Taman Suropati Jakarta
12. Planetarium Jakarta
13. Museum Bank Indonesia
14. Taman Lapangan Banteng
15. Bundaran HI Jakarta

## Cara Menggunakan

### Pencarian Tempat Wisata
1. Klik tombol peta di sidebar kiri untuk membuka panel pencarian
2. Ketik nama tempat wisata yang ingin dicari (contoh: "museum", "taman", "monas")
3. Sistem akan otomatis mencari setelah 500ms
4. Hasil pencarian akan muncul dalam daftar dengan informasi:
   - Foto tempat
   - Nama tempat
   - Kategori
   - Lokasi
   - Deskripsi singkat
   - Estimasi jumlah pengunjung

### Menggunakan Filter
1. Klik ikon filter di samping kotak pencarian
2. Pilih kategori yang diinginkan (Museum, Monumen, Taman, dll)
3. Klik "Terapkan" untuk melihat hasil yang difilter
4. Klik "Atur ulang" untuk menghapus filter

### Melihat Detail Tempat
1. Klik pada tempat wisata dari daftar hasil pencarian
2. Peta akan terbang (fly) ke lokasi tempat tersebut
3. Pop-up akan muncul menampilkan:
   - Foto tempat yang lebih besar
   - Informasi lengkap
   - Tombol "Lihat Detail" untuk informasi lebih lanjut

## Implementasi Teknis

### API Integration
```typescript
const searchPlaces = async (query: string) => {
  // Multiple search queries for better results
  const touristCategories = [
    `wisata ${query}`,
    `tempat wisata ${query}`,
    query
  ];
  
  // Fetch from Mapbox Geocoding API
  // Filter by POI type
  // Remove duplicates
  // Return formatted results
}
```

### Category Detection
Sistem menggunakan logika multi-layer untuk mendeteksi kategori:
1. Memeriksa category dari API response
2. Memeriksa place_type dari API
3. Memeriksa teks nama tempat (bahasa Indonesia dan Inggris)
4. Memeriksa place_name untuk konteks tambahan

### Data Structure
```typescript
interface Place {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  visitors: string;
  image: string;
  coordinates: [number, number];
}
```

## Konfigurasi

### Environment Variables
Aplikasi membutuhkan Mapbox Access Token:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

Dapatkan token dari: https://www.mapbox.com/

### Customize Default Destinations
Edit array `touristDestinations` di fungsi `loadDefaultPlaces()`:
```typescript
const touristDestinations = [
  'Tempat Wisata 1',
  'Tempat Wisata 2',
  // ... tambahkan destinasi lainnya
];
```

## Peningkatan di Masa Depan
- [ ] Integrasi dengan API wisata lokal Indonesia
- [ ] Fitur review dan rating dari pengguna
- [ ] Rute perjalanan antar destinasi
- [ ] Filter berdasarkan jarak
- [ ] Filter berdasarkan jam operasional
- [ ] Dukungan multi-bahasa
- [ ] Bookmark tempat favorit
- [ ] Share destinasi ke media sosial

## Troubleshooting

### Tidak ada hasil pencarian
- Pastikan koneksi internet stabil
- Pastikan Mapbox token valid dan aktif
- Coba kata kunci yang berbeda
- Coba hapus filter kategori

### Peta tidak muncul
- Periksa Mapbox token di file `.env.local`
- Pastikan browser mendukung WebGL
- Refresh halaman

### Error pada API
- Periksa quota Mapbox API
- Periksa koneksi internet
- Lihat console browser untuk error detail

## Kontribusi
Untuk berkontribusi pada pengembangan fitur ini:
1. Fork repository
2. Buat branch baru untuk fitur
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi
Lihat file LICENSE di root repository.
