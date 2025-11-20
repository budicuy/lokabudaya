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
				center: [106.8272, -6.1751],
				zoom: 16,
				pitch: 60,
				bearing: -17.6,
				antialias: true,
			});

			map.current.on("style.load", () => {
				map.current.setConfig("basemap", {
					showPointOfInterestLabels: false,
					showPlaceLabels: false,
					showRoadLabels: false,
					showTransitLabels: false,
				});
				setLoaded(true);
			});
		};

		return () => {
			if (map.current) map.current.remove();
		};
	}, []);

	const zoomIn = () => map.current?.zoomIn();
	const zoomOut = () => map.current?.zoomOut();

	return {mapContainer, map, loaded, zoomIn, zoomOut};
};
