# Loka Budaya

Aplikasi Pemetaan Budaya Berbasis GIS untuk eksplorasi tempat-tempat wisata dan budaya di Indonesia.

## Fitur Utama

### 🗺️ Peta Interaktif 3D
- Visualisasi 3D menggunakan Mapbox GL JS
- Tampilan bangunan 3D untuk pengalaman yang lebih immersive
- Navigasi peta yang smooth dan responsif

### 🔍 Pencarian Tempat Wisata Dinamis
- Pencarian real-time menggunakan Mapbox Geocoding API
- Fokus pada destinasi wisata (museum, monumen, taman, dll)
- Kategorisasi otomatis untuk berbagai jenis tempat wisata
- Filter berdasarkan kategori
- **Lihat [SEARCH_FEATURE.md](./SEARCH_FEATURE.md) untuk dokumentasi lengkap**

### 📍 Marker Interaktif
- Marker untuk setiap tempat wisata
- Pop-up informatif dengan detail tempat
- Animasi fly-to saat mengklik tempat

## Getting Started

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm, yarn, pnpm, atau bun
- Mapbox Access Token (gratis dari [Mapbox](https://www.mapbox.com/))

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/budicuy/lokabudaya.git
cd lokabudaya
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Setup environment variables:
Buat file `.env.local` di root project dan tambahkan Mapbox token:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Jalankan development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser

## Cara Menggunakan

1. **Mencari Tempat Wisata**
   - Klik icon peta di sidebar kiri untuk membuka panel pencarian
   - Ketik nama tempat yang ingin dicari (contoh: "museum", "monas", "taman")
   - Hasil akan muncul otomatis saat mengetik

2. **Menggunakan Filter**
   - Klik icon filter untuk memilih kategori tertentu
   - Pilih kategori: Museum, Monumen, Taman, Tempat Ibadah, dll
   - Klik "Terapkan" untuk melihat hasil yang difilter

3. **Menjelajahi Peta**
   - Gunakan tombol + dan - untuk zoom in/out
   - Drag untuk menggeser peta
   - Klik marker untuk melihat detail tempat

## Teknologi yang Digunakan

- **Framework**: Next.js 16 (dengan React 19)
- **Styling**: Tailwind CSS 4
- **Maps**: Mapbox GL JS v3.17.0
- **Icons**: Lucide React
- **Language**: TypeScript
- **Code Quality**: Biome (linting & formatting)

## Struktur Project

```
lokabudaya/
├── app/
│   ├── page.tsx          # Halaman utama dengan peta dan fitur pencarian
│   ├── layout.tsx        # Layout aplikasi
│   └── globals.css       # Global styles
├── public/               # Static assets
├── SEARCH_FEATURE.md     # Dokumentasi fitur pencarian
└── package.json
```

## Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan linter (Biome)
- `npm run format` - Format code dengan Biome

## Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Learn More

Untuk mempelajari lebih lanjut tentang teknologi yang digunakan:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) - Mapbox documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Tailwind documentation
- [TypeScript](https://www.typescriptlang.org/docs/) - TypeScript handbook

## Deploy on Vercel

Cara termudah untuk deploy aplikasi Next.js adalah menggunakan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Lihat [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) untuk detail lebih lanjut.

## Lisensi

MIT License - lihat file LICENSE untuk detail.

## Credits

- Maps powered by [Mapbox](https://www.mapbox.com/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/)
