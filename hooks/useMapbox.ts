import {useEffect, useRef, useState} from "react";

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: Mapbox GL type not available
		mapboxgl: any;
	}
}

export const useMapbox = () => {
	const mapContainer = useRef<HTMLDivElement>(null);
	// biome-ignore lint/suspicious/noExplicitAny: Mapbox GL type not available
	const map = useRef<any>(null);
	const [loaded, setLoaded] = useState(false);

	// State untuk mengontrol visibilitas label
	const [showPlaceLabels, setShowPlaceLabels] = useState(true);
	const [showRoadLabels, setShowRoadLabels] = useState(true);
	const [showPointOfInterestLabels, setShowPointOfInterestLabels] = useState(false);
	const [showTransitLabels, setShowTransitLabels] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: useEffect hanya dijalankan sekali untuk inisialisasi map
	useEffect(() => {
		if (map.current) return;

		const script = document.createElement("script");
		script.src = "https://api.mapbox.com/mapbox-gl-js/v3.17.0-beta.1/mapbox-gl.js";
		script.async = true;
		document.head.appendChild(script);

		const link = document.createElement("link");
		link.href = "https://api.mapbox.com/mapbox-gl-js/v3.17.0-beta.1/mapbox-gl.css";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		script.onload = () => {
			const mapboxgl = window.mapboxgl;
			mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";

			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/standard",
				center: [118.0149, -2.5489], // Center of Indonesia
				zoom: 4, // Zoom level to see the whole country
				pitch: 0, // Top-down view
				bearing: 0, // North up
				antialias: true,
			});

			map.current.on("style.load", () => {
				map.current.setConfig("basemap", {showPointOfInterestLabels, showPlaceLabels, showRoadLabels, showTransitLabels});
				setLoaded(true);
			});
		};

		return () => {
			if (map.current) map.current.remove();
		};
	}, []);

	// Update konfigurasi basemap ketika state label berubah
	useEffect(() => {
		if (!map.current || !loaded) return;

		const updateConfig = () => {
			if (map.current) {
				map.current.setConfig("basemap", {showPointOfInterestLabels, showPlaceLabels, showRoadLabels, showTransitLabels});
			}
		};

		// Update konfigurasi sekarang
		updateConfig();

		// Tambahkan listener untuk ketika style berubah
		map.current.on("style.load", updateConfig);

		return () => {
			if (map.current) {
				map.current.off("style.load", updateConfig);
			}
		};
	}, [loaded, showPlaceLabels, showRoadLabels, showPointOfInterestLabels, showTransitLabels]);

	const zoomIn = () => map.current?.zoomIn();
	const zoomOut = () => map.current?.zoomOut();

	// Fungsi toggle untuk setiap kategori label
	const togglePlaceLabels = () => setShowPlaceLabels((prev) => !prev);
	const toggleRoadLabels = () => setShowRoadLabels((prev) => !prev);
	const togglePointOfInterestLabels = () => setShowPointOfInterestLabels((prev) => !prev);
	const toggleTransitLabels = () => setShowTransitLabels((prev) => !prev);

	return {
		mapContainer,
		map,
		loaded,
		zoomIn,
		zoomOut,
		// Layer control
		showPlaceLabels,
		showRoadLabels,
		showPointOfInterestLabels,
		showTransitLabels,
		togglePlaceLabels,
		toggleRoadLabels,
		togglePointOfInterestLabels,
		toggleTransitLabels,
	};
};
