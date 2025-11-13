
'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Map, MapPin, Settings, Moon, X, Plus, Minus, Layers, Building2, Landmark, MapPinned, Grid3x3 } from 'lucide-react';

interface Place {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
  visitors: string;
  image: string;
}

declare global {
  interface Window {
    mapboxgl: any;
  }
}

export default function MapBox3D() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<(Place & { coordinates: [number, number] })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allPlaces, setAllPlaces] = useState<(Place & { coordinates: [number, number] })[]>([]);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  // Function to search tourist destinations using Mapbox Geocoding API
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      // Load default places for Jakarta
      loadDefaultPlaces();
      return;
    }

    setIsSearching(true);
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE';

    try {
      // Enhanced search for tourist destinations: museums, monuments, parks, attractions
      // Multiple searches with different categories to get comprehensive results
      const touristCategories = [
        `wisata ${query}`,  // tourist + query
        `tempat wisata ${query}`,  // tourist destination + query
        query  // original query
      ];

      const allResults: any[] = [];
      
      // Search with different category prefixes to get tourism-focused results
      for (const searchTerm of touristCategories) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?` +
          `access_token=${accessToken}&` +
          `country=ID&` +
          `proximity=106.8272,-6.1751&` +
          `types=poi&` +  // Focus on points of interest for tourist destinations
          `limit=10&` +
          `language=id`
        );

        const data = await response.json();
        if (data.features && data.features.length > 0) {
          allResults.push(...data.features);
        }
      }

      // Remove duplicates based on coordinates
      const uniquePlaces = allResults.filter((feature, index, self) =>
        index === self.findIndex((f) => 
          f.center[0] === feature.center[0] && f.center[1] === feature.center[1]
        )
      );

      if (uniquePlaces.length > 0) {
        const newPlaces = uniquePlaces.slice(0, 20).map((feature: any, index: number) => {
          const category = getCategoryFromFeature(feature);
          const visitors = Math.floor(Math.random() * 500) + 50;

          return {
            id: index + 1,
            name: feature.text || feature.place_name.split(',')[0],
            category: category,
            location: feature.place_name.split(',').slice(1).join(',').trim() || 'Jakarta, Indonesia',
            description: feature.properties?.address || `${feature.text} adalah salah satu tempat wisata menarik di ${feature.place_name.split(',')[1] || 'Jakarta'}`,
            visitors: `${visitors} orang pernah ke sini`,
            image: getImageFromCategory(category),
            coordinates: feature.center as [number, number]
          };
        });

        setAllPlaces(newPlaces);
        setPlaces(newPlaces);
      } else {
        // If no results, show empty state
        setAllPlaces([]);
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error searching tourist destinations:', error);
      // Show error but don't load defaults to give user feedback
      setAllPlaces([]);
      setPlaces([]);
    } finally {
      setIsSearching(false);
    }
  };  // Load default tourist destinations for Jakarta
  const loadDefaultPlaces = async () => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE';
    const touristDestinations = [
      'Monumen Nasional Jakarta',
      'Museum Nasional Jakarta',
      'Taman Mini Indonesia Indah',
      'Kota Tua Jakarta',
      'Ancol Jakarta Bay City',
      'Taman Impian Jaya Ancol',
      'Masjid Istiqlal Jakarta',
      'Gereja Katedral Jakarta',
      'Museum Fatahillah Jakarta',
      'Istana Merdeka Jakarta',
      'Taman Suropati Jakarta',
      'Planetarium Jakarta',
      'Museum Bank Indonesia',
      'Taman Lapangan Banteng',
      'Bundaran HI Jakarta'
    ];

    const allPlaces: (Place & { coordinates: [number, number] })[] = [];

    for (const destination of touristDestinations) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?` +
          `access_token=${accessToken}&` +
          `country=ID&` +
          `limit=1&` +
          `language=id`
        );

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const category = getCategoryFromFeature(feature);
          const visitors = Math.floor(Math.random() * 500) + 50;

          allPlaces.push({
            id: allPlaces.length + 1,
            name: feature.text || feature.place_name.split(',')[0],
            category: category,
            location: feature.place_name.split(',').slice(1).join(',').trim() || 'Jakarta, Indonesia',
            description: `${feature.text} adalah salah satu destinasi wisata populer dan landmark bersejarah di Jakarta yang wajib dikunjungi`,
            visitors: `${visitors} orang pernah ke sini`,
            image: getImageFromCategory(category),
            coordinates: feature.center as [number, number]
          });
        }
      } catch (error) {
        console.error(`Error loading ${destination}:`, error);
      }
    }

    setAllPlaces(allPlaces);
    setPlaces(allPlaces);
  };

  // Helper function to determine category from feature - enhanced for tourism
  const getCategoryFromFeature = (feature: any): string => {
    const properties = feature.properties || {};
    const category = properties.category || '';
    const placeType = feature.place_type?.[0] || '';
    const text = feature.text?.toLowerCase() || '';
    const placeName = feature.place_name?.toLowerCase() || '';

    // Enhanced categorization for tourist destinations
    if (
      category.includes('museum') || 
      text.includes('museum') || 
      placeName.includes('museum')
    ) {
      return 'Museum';
    } else if (
      category.includes('monument') || 
      text.includes('monumen') || 
      text.includes('tugu') ||
      placeName.includes('monumen')
    ) {
      return 'Monumen';
    } else if (
      category.includes('park') || 
      category.includes('garden') ||
      text.includes('taman') || 
      text.includes('kebun') ||
      placeName.includes('taman')
    ) {
      return 'Taman';
    } else if (
      category.includes('mosque') || 
      category.includes('church') ||
      category.includes('temple') ||
      text.includes('masjid') || 
      text.includes('gereja') ||
      text.includes('candi') ||
      text.includes('pura')
    ) {
      return 'Tempat Ibadah';
    } else if (
      category.includes('palace') || 
      category.includes('castle') ||
      text.includes('istana') || 
      text.includes('keraton')
    ) {
      return 'Istana';
    } else if (
      text.includes('pantai') || 
      text.includes('beach') ||
      placeName.includes('pantai')
    ) {
      return 'Pantai';
    } else if (
      text.includes('mall') || 
      text.includes('plaza') ||
      text.includes('pusat belanja')
    ) {
      return 'Pusat Belanja';
    } else if (placeType === 'poi') {
      return 'Tempat Wisata';
    } else {
      return 'Kawasan';
    }
  };

  // Helper function to get image based on category - enhanced for tourism
  const getImageFromCategory = (category: string): string => {
    const images: { [key: string]: string } = {
      'Museum': 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=400&h=300&fit=crop',
      'Monumen': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      'Taman': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
      'Tempat Ibadah': 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&h=300&fit=crop',
      'Istana': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop',
      'Pantai': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      'Pusat Belanja': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop',
      'Tempat Wisata': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
      'Kawasan': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
      'Bangunan': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      'Situs': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop',
      'Struktur': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop';
  };

  // Load default places on mount
  useEffect(() => {
    loadDefaultPlaces();
  }, []);

  useEffect(() => {
    if (map.current) return;

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.17.0-beta.1/mapbox-gl.js';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.17.0-beta.1/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    script.onload = () => {
      const mapboxgl = window.mapboxgl;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE';

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: [106.8272, -6.1751],
        zoom: 16,
        pitch: 60,
        bearing: -17.6,
        antialias: true
      });

      map.current.on('style.load', () => {
        // Mapbox Standard Style uses different configuration
        // Enable 3D buildings through style configuration
        if (map.current.getLayer('building-3d')) {
          // Buildings are already part of the standard style
          console.log('3D buildings enabled in Standard Style');
        }

        setLoaded(true);
      });
    };

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  const zoomIn = () => map.current?.zoomIn();
  const zoomOut = () => map.current?.zoomOut();

  const handlePlaceClick = (place: Place & { coordinates: [number, number] }) => {
    setSelectedPlace(place);
    if (map.current) {
      map.current.flyTo({
        center: place.coordinates,
        zoom: 17,
        pitch: 60,
        bearing: -17.6,
        duration: 2000
      });
    }
  };

  // Update popup position when map moves or selectedPlace changes
  useEffect(() => {
    if (!map.current || !selectedPlace) {
      setPopupPosition(null);
      return;
    }

    const updatePopupPosition = () => {
      if (selectedPlace && map.current && 'coordinates' in selectedPlace) {
        const point = map.current.project(selectedPlace.coordinates);
        setPopupPosition({ x: point.x, y: point.y });
      }
    };

    // Update position on map move
    map.current.on('move', updatePopupPosition);
    map.current.on('zoom', updatePopupPosition);
    map.current.on('rotate', updatePopupPosition);
    map.current.on('pitch', updatePopupPosition);

    // Initial position
    updatePopupPosition();

    return () => {
      if (map.current) {
        map.current.off('move', updatePopupPosition);
        map.current.off('zoom', updatePopupPosition);
        map.current.off('rotate', updatePopupPosition);
        map.current.off('pitch', updatePopupPosition);
      }
    };
  }, [selectedPlace]);

  // Add markers after map is loaded
  useEffect(() => {
    if (!loaded || !map.current) return;

    const mapboxgl = window.mapboxgl;
    const markers: any[] = [];

    places.forEach(place => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .addTo(map.current);

      markers.push(marker);

      el.addEventListener('click', () => {
        handlePlaceClick(place);
      });
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [loaded, places]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      loadDefaultPlaces();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces(searchQuery);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchPlaces(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter places by category
  useEffect(() => {
    if (selectedCategory) {
      setPlaces(allPlaces.filter(place => place.category === selectedCategory));
    } else {
      setPlaces(allPlaces);
    }
  }, [selectedCategory, allPlaces]);

  const toggleCategory = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <nav className="h-14 bg-white flex items-center justify-between px-4 z-20 border-b-2 border-slate-300">
        <div className="flex items-center gap-4">
          <svg xmlns="https://www.w3.org/2000/svg" width="42" height="40" viewBox="0 0 42 40" fill="none" aria-label="Loka Budaya Logo">
            <title>Loka Budaya</title>
            <path fillRule="evenodd" clipRule="evenodd" d="M20.9901 35.9628C20.8178 35.9968 20.6392 36.008 20.4582 35.9943C14.8651 35.5696 9.57124 32.4782 6.55501 27.2506C3.53874 22.0228 3.51025 15.8894 5.93937 10.8301C6.29203 10.0956 7.05653 9.65396 7.86854 9.71562C9.95281 9.87386 11.9955 10.4024 13.8943 11.2739C15.3271 8.4784 17.4469 6.09361 20.0306 4.3427C20.7049 3.88577 21.5868 3.88577 22.2611 4.3427C24.8098 6.06984 26.907 8.41375 28.3386 11.1603C30.1654 10.3564 32.1195 9.86686 34.1116 9.71562C34.9236 9.65396 35.6881 10.0956 36.0408 10.8301C38.4699 15.8894 38.4414 22.0228 35.4251 27.2506C32.4089 32.4782 27.115 35.5696 21.5219 35.9943C21.3409 36.008 21.1623 35.9968 20.9901 35.9628ZM25.0879 32.7938C28.4405 31.6528 31.4058 29.3374 33.3137 26.0307C35.8532 21.6292 35.9359 16.4823 33.9783 12.1758C32.3707 12.3318 30.7973 12.7433 29.3211 13.3928C30.0413 15.3748 30.4341 17.5141 30.4341 19.7451C30.4341 24.8298 28.3939 29.4377 25.0879 32.7938ZM26.1801 12.2947C24.984 9.99699 23.2513 8.0225 21.1459 6.53694C18.9954 8.05431 17.2336 10.0818 16.0355 12.4428C17.9424 13.6631 19.6365 15.2683 20.9901 17.2242C22.3991 15.1881 24.1771 13.5321 26.1801 12.2947ZM22.3714 19.5905C23.5965 17.4994 25.2465 15.8097 27.1494 14.5685C27.6985 16.1937 27.996 17.9347 27.996 19.7451C27.996 23.9247 26.4104 27.7342 23.8036 30.6037C24.5089 26.9789 24.0823 23.1183 22.3714 19.5905ZM19.6087 19.5905C18.4387 17.5934 16.8811 15.9625 15.0859 14.7386C14.5729 16.315 14.2957 17.9977 14.2957 19.7451C14.2957 23.7104 15.7229 27.3425 18.0952 30.1549C17.5085 26.6616 17.9683 22.9731 19.6087 19.5905ZM20.9901 31.7961C21.9053 28.8836 21.9429 25.7064 20.9901 22.6944C20.0372 25.7064 20.0748 28.8836 20.9901 31.7961ZM8.66646 26.0307C10.661 29.4877 13.8113 31.8612 17.3514 32.942C13.9587 29.574 11.8576 24.9051 11.8576 19.7451C11.8576 17.5594 12.2346 15.4618 12.9271 13.5139C11.3739 12.7942 9.70713 12.3413 8.00187 12.1758C6.04422 16.4823 6.12691 21.6292 8.66646 26.0307Z" fill="#FDB813" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 hidden md:inline">Menu</span>
          <span className="text-sm text-gray-700 hidden md:inline">Menu</span>
        </div>
      </nav>

      <div className="flex-1 flex relative overflow-hidden">
        <aside className="w-16 border-r-2 border-slate-300 bg-white flex flex-col z-10">
          <div className="flex flex-col items-center py-4 gap-4 flex-1">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-10 h-10 ${searchOpen ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 text-gray-600'} rounded-lg flex items-center justify-center`}
            >
              <Map className="w-5 h-5" />
            </button>
            <button type="button" className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5" />
            </button>
            <button type="button" className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5" />
            </button>
            <button type="button" className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-center py-4 gap-4">
            <button type="button" className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <button type="button" className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <Moon className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="User" className="w-full h-full" />
            </div>
          </div>
        </aside>

        {searchOpen && (
          <div className="w-80 bg-white flex flex-col z-10 shadow-lg">
            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari tempat wisata, museum, taman..."
                  className="bg-transparent outline-none text-sm flex-1"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <button type="button" onClick={() => setFilterOpen(!filterOpen)} className="p-1 hover:bg-gray-200 rounded">
                  <svg className="w-4 h-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor" aria-label="Filter">
                    <title>Filter</title>
                    <path d="M3 3h14M3 7h10M3 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
              <span>Hasil Pencarian ({places.length})</span>
              {isSearching && <span className="text-yellow-600">Mencari...</span>}
            </div>

            <div className="flex-1 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Mencari tempat...</p>
                  </div>
                </div>
              ) : places.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center px-4">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Tidak ada tempat wisata ditemukan</p>
                    <p className="text-xs text-gray-400">Coba kata kunci lain atau hapus filter</p>
                  </div>
                </div>
              ) : (
                places.map(place => (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className="p-4 hover:bg-gray-50 cursor-pointer w-full text-left"
                    type="button"
                  >
                    <div className="flex gap-3">
                      <img src={place.image} alt={place.name} className="w-32 h-24 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Building2 className="w-3 h-3" />
                          <span>{place.category}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{place.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{place.location}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{place.description}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <MapPin className="w-3 h-3" />
                          <span>{place.visitors}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {filterOpen && (
          <div className="absolute left-96 top-0 w-64 bg-white rounded-lg shadow-xl z-20 m-4 p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Filter</h3>
              <p className="text-xs text-gray-500">Filter konten untuk menyesuaikan pencarian</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Urutkan</h4>
                <button type="button" className="text-xs text-blue-600">Pilih semua</button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="sort" className="w-4 h-4" />
                  <span>Populer</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="sort" className="w-4 h-4" />
                  <span>Terbanyak dikunjungi</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="sort" className="w-4 h-4" />
                  <span>Terdekat</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Kategori</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory('Museum')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Museum'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  <Building2 className="w-3 h-3" />
                  Museum
                </button>
                <button
                  onClick={() => toggleCategory('Monumen')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Monumen'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  <Landmark className="w-3 h-3" />
                  Monumen
                </button>
                <button
                  onClick={() => toggleCategory('Taman')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Taman'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  Taman
                </button>
                <button
                  onClick={() => toggleCategory('Tempat Ibadah')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Tempat Ibadah'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  Tempat Ibadah
                </button>
                <button
                  onClick={() => toggleCategory('Istana')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Istana'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  Istana
                </button>
                <button
                  onClick={() => toggleCategory('Tempat Wisata')}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${selectedCategory === 'Tempat Wisata'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  type="button"
                >
                  <MapPinned className="w-3 h-3" />
                  Tempat Wisata
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                Atur ulang
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />

          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">Loading map...</p>
            </div>
          )}

          {selectedPlace && popupPosition && (
            <div
              className="absolute w-96 bg-white rounded-lg shadow-2xl z-20"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                transform: 'translate(-50%, calc(-100% - 20px))',
                pointerEvents: 'auto'
              }}
            >
              <div className="overflow-hidden rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center z-10 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative">
                  <div className="text-xs bg-white px-2 py-1 rounded absolute top-2 left-2 flex items-center gap-1 shadow">
                    <Landmark className="w-3 h-3" />
                    {selectedPlace.category}
                  </div>
                  <div className="text-xs bg-white px-2 py-1 rounded absolute top-2 right-12 flex items-center gap-1 shadow">
                    <MapPin className="w-3 h-3" />
                    150+ Kunjungan
                  </div>
                  <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedPlace.location}</p>
                  <p className="text-sm text-gray-700 mb-4">{selectedPlace.description}</p>
                  <button type="button" className="w-full bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900">
                    Lihat Detail
                    <span>→</span>
                  </button>
                </div>
              </div>
              {/* Arrow pointing down */}
              <div
                className="absolute left-1/2 w-0 h-0"
                style={{
                  bottom: '-10px',
                  transform: 'translateX(-50%)',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white',
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                }}
              ></div>
            </div>
          )}

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              type="button"
              onClick={zoomIn}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={zoomOut}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          <button type="button" className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 z-10">
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div >
  );
}