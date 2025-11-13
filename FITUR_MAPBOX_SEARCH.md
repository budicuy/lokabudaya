# Fitur Mapbox Search - Lokabudaya

## 🎯 Overview
Aplikasi ini telah diintegrasikan dengan **Mapbox Geocoding API** untuk mendapatkan data tempat wisata dan landmark secara dinamis.

## ✨ Fitur yang Telah Diimplementasi

### 1. **Dynamic Data Loading**
- ✅ Data tempat dimuat secara dinamis menggunakan Mapbox Geocoding API
- ✅ 10 landmark default Jakarta dimuat saat aplikasi pertama kali dibuka:
  - Monumen Nasional Jakarta
  - Istana Merdeka Jakarta
  - Masjid Istiqlal Jakarta
  - Gereja Katedral Jakarta
  - Museum Nasional Jakarta
  - Taman Mini Indonesia Indah
  - Kota Tua Jakarta
  - Ancol Jakarta
  - Bundaran HI Jakarta
  - Gelora Bung Karno

### 2. **Real-time Search**
- ✅ Pencarian real-time dengan debouncing (500ms)
- ✅ Search saat user mengetik di input field
- ✅ Otomatis mencari tempat di Indonesia (country: ID)
- ✅ Proximity search berdasarkan Jakarta center (106.8272, -6.1751)
- ✅ Mendukung 20 hasil pencarian
- ✅ Bahasa Indonesia (language: id)

### 3. **Category Filtering**
- ✅ Filter berdasarkan kategori:
  - **Bangunan**: Monumen, Museum, Masjid, Gereja, Istana
  - **Situs**: Point of Interest (POI)
  - **Kawasan**: Area/Place
  - **Struktur**: Struktur khusus
- ✅ Toggle kategori (klik untuk filter, klik lagi untuk unfilter)
- ✅ Visual feedback dengan warna kuning untuk kategori aktif
- ✅ Tombol "Atur ulang" untuk clear semua filter

### 4. **Interactive Map Integration**
- ✅ Markers otomatis ditambahkan untuk setiap tempat
- ✅ Klik marker atau item di sidebar untuk fly to location
- ✅ Smooth animation saat pindah lokasi (2 detik)
- ✅ Popup dengan panah menunjuk ke lokasi marker

### 5. **Smart Category Detection**
Sistem otomatis mendeteksi kategori berdasarkan:
- Feature properties dari Mapbox
- Keyword matching dari nama tempat:
  - "monumen" → Bangunan
  - "museum" → Bangunan
  - "masjid" → Bangunan
  - "gereja" → Bangunan
  - "istana" → Bangunan
  - POI type → Situs
  - Default → Kawasan

### 6. **Dynamic Images**
Setiap kategori memiliki gambar placeholder dari Unsplash:
- **Bangunan**: Arsitektur Indonesia
- **Situs**: Tempat bersejarah
- **Kawasan**: Pemandangan kota
- **Struktur**: Struktur modern

### 7. **Loading States**
- ✅ Loading spinner saat mencari data
- ✅ "Mencari..." indicator di header
- ✅ Empty state ketika tidak ada hasil
- ✅ Smooth transitions

### 8. **User Experience Improvements**
- ✅ Auto-load default places saat search dikosongkan
- ✅ Enter key untuk submit search
- ✅ Visual feedback pada semua button interactions
- ✅ Responsive design
- ✅ Real-time update hasil pencarian

## 🔧 Technical Implementation

### API Endpoints Used
```javascript
// Geocoding API untuk search
https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json

// Parameters:
- access_token: NEXT_PUBLIC_MAPBOX_TOKEN
- country: ID (Indonesia only)
- proximity: 106.8272,-6.1751 (Jakarta center)
- types: poi,address,place
- limit: 20
- language: id
```

### State Management
```typescript
const [places, setPlaces] = useState([])           // Filtered places
const [allPlaces, setAllPlaces] = useState([])     // All places before filter
const [searchQuery, setSearchQuery] = useState('') // Search input
const [isSearching, setIsSearching] = useState(false) // Loading state
const [selectedCategory, setSelectedCategory] = useState(null) // Active filter
```

### Key Functions
1. `searchPlaces(query)` - Search menggunakan Mapbox API
2. `loadDefaultPlaces()` - Load 10 landmark Jakarta
3. `getCategoryFromFeature(feature)` - Auto-detect kategori
4. `getImageFromCategory(category)` - Get image berdasarkan kategori
5. `toggleCategory(category)` - Toggle filter kategori
6. `handlePlaceClick(place)` - Fly to location dan show popup

## 📊 Data Flow

```
User Input → Debounce (500ms) → Mapbox API → Transform Data → State Update → UI Render
                                                    ↓
                                           Category Detection
                                           Image Assignment
                                           Visitor Count (Random)
```

## 🎨 UI Components

### Search Bar
- Input dengan autocomplete behavior
- Clear button (X)
- Filter toggle button
- Form submission on Enter

### Results List
- Image thumbnail
- Category badge
- Place name
- Location
- Description
- Visitor count
- Click to fly to location

### Filter Panel
- Sort options (UI only, belum berfungsi)
- Category filters (✅ berfungsi)
- Reset button
- Apply button

### Map Popup
- Image header
- Category badge
- Visitor badge
- Title
- Location
- Description
- "Lihat Detail" button
- Arrow pointing to marker

## 🚀 Future Enhancements

### Suggested Improvements
1. **Sorting**
   - Implementasi sort by popularity
   - Sort by distance
   - Sort by visitor count

2. **Search History**
   - Save recent searches
   - Quick access to previous searches

3. **Favorites**
   - Save favorite places
   - Local storage persistence

4. **Detailed Information**
   - Opening hours
   - Contact information
   - Reviews/ratings
   - Photos from Mapbox Static Images API

5. **Directions**
   - Route planning
   - Navigation instructions
   - Distance and time estimates

6. **Advanced Filters**
   - Distance range
   - Rating filter
   - Open now filter

## 🔑 Environment Variables

```bash
NEXT_PUBLIC_MAPBOX_TOKEN="your_mapbox_token_here"
```

## 📝 Notes

- Data dinamis dari Mapbox Geocoding API
- Visitor count di-generate random (50-500)
- Description otomatis generated dari feature data
- Images menggunakan Unsplash placeholders
- Coordinates langsung dari Mapbox API
- Support untuk Indonesia region only (country=ID)

## 🎯 Performance

- Debounced search: 500ms delay
- API calls: Optimized dengan cleanup
- Markers: Auto-cleanup saat component unmount
- State updates: Minimal re-renders dengan proper dependencies
