"use client";

import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import {createRoot} from "react-dom/client";
import Supercluster from "supercluster";
import {FilterPanel} from "@/components/FilterPanel";
import {JejakBudaya} from "@/components/JejakBudaya";
import {LayerModal} from "@/components/LayerModal";
import {MapControls} from "@/components/MapControls";
import {MapPopup} from "@/components/MapPopup";
import {Navbar} from "@/components/Navbar";
import {PlaceDetail} from "@/components/PlaceDetail";
import {SearchPanel} from "@/components/SearchPanel";
import {Sidebar} from "@/components/Sidebar";
import {useMapbox} from "@/hooks/useMapbox";
import {usePlacesFilter} from "@/hooks/usePlacesFilter";
import type {Place} from "@/types";

// Convert places to GeoJSON features
const placesToFeatures = (places: Place[]) =>
	places.map((place) => ({
		type: "Feature" as const,
		properties: {id: place.id, name: place.name, category: place.category, image: place.image, location: place.location},
		geometry: {type: "Point" as const, coordinates: place.coordinates as [number, number]},
	}));

function MapContent() {
	const searchParams = useSearchParams();
	const {
		mapContainer,
		map,
		loaded,
		zoomIn,
		zoomOut,
		showPlaceLabels,
		showRoadLabels,
		showPointOfInterestLabels,
		showTransitLabels,
		togglePlaceLabels,
		toggleRoadLabels,
		togglePointOfInterestLabels,
		toggleTransitLabels,
	} = useMapbox();
	const {
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		filteredPlaces,
		toggleCategory,
		refreshPlaces,
		places,
	} = usePlacesFilter();

	const [searchOpen, setSearchOpen] = useState(true);
	const [filterOpen, setFilterOpen] = useState(false);
	const [layerOpen, setLayerOpen] = useState(false);
	const [jejakBudayaOpen, setJejakBudayaOpen] = useState(false);
	const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/standard");
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	// biome-ignore lint/suspicious/noExplicitAny: mapbox marker type
	const markersRef = useRef<Map<string, any>>(new Map());
	const superclusterRef = useRef<Supercluster | null>(null);

	// Sync selectedPlace with updated places data
	// biome-ignore lint/correctness/useExhaustiveDependencies: only trigger on places change
	useEffect(() => {
		if (selectedPlace) {
			const updatedPlace = places.find((p) => p.id === selectedPlace.id);
			if (updatedPlace) {
				setSelectedPlace(updatedPlace);
			}
		}
	}, [places]);

	const handlePlaceClick = useCallback(
		(place: Place) => {
			setSelectedPlace(place);
			setFilterOpen(false);
			// Navigate map to the place coordinates
			if (map.current) {
				map.current.resize();
				map.current.flyTo({center: place.coordinates, zoom: 16, duration: 1500, essential: true});
			}
			// Close all popups first
			for (const marker of markersRef.current.values()) {
				const popup = marker.getPopup?.();
				if (popup?.isOpen()) {
					popup.remove();
				}
			}
			// Open the selected marker popup
			setTimeout(() => {
				const marker = markersRef.current.get(`place-${place.id}`);
				if (marker) {
					const popup = marker.getPopup();
					if (popup) {
						popup.addTo(map.current);
					}
				}
			}, 100);
		},
		[map],
	);

	const flyToPlace = (place: Place) => {
		handlePlaceClick(place);
	};

	const handleMapStyleChange = (style: string) => {
		setMapStyle(style);
		if (map.current && loaded) {
			map.current.setStyle(style);
		}
	};

	// Update markers based on clustering
	// biome-ignore lint/correctness/useExhaustiveDependencies: map.current is a ref
	const updateMarkers = useCallback(() => {
		if (!map.current || !loaded || !superclusterRef.current) return;

		const mapboxgl = window.mapboxgl;
		const currentMap = map.current;
		const cluster = superclusterRef.current;

		// Get current map bounds and zoom
		const bounds = currentMap.getBounds();
		const zoom = Math.floor(currentMap.getZoom());

		// Get clusters for current view
		const clusters = cluster.getClusters(
			[bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
			zoom,
		);

		// Track which markers should exist
		const currentMarkerIds = new Set<string>();

		for (const feature of clusters) {
			const coords = feature.geometry.coordinates as [number, number];
			const props = feature.properties;

			if (props.cluster) {
				// Handle cluster marker
				const markerId = `cluster-${props.cluster_id}`;
				currentMarkerIds.add(markerId);

				if (!markersRef.current.has(markerId)) {
					// Create cluster marker element
					const el = document.createElement("div");
					el.className = "cluster-marker";
					el.style.width = "50px";
					el.style.height = "50px";
					el.style.borderRadius = "50%";
					el.style.backgroundColor = "#1e3a5f";
					el.style.border = "3px solid white";
					el.style.display = "flex";
					el.style.alignItems = "center";
					el.style.justifyContent = "center";
					el.style.color = "white";
					el.style.fontWeight = "bold";
					el.style.fontSize = "14px";
					el.style.cursor = "pointer";
					el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
					el.textContent = String(props.point_count);

					// Click to zoom into cluster
					const clusterId = props.cluster_id;
					el.addEventListener("click", () => {
						const expansionZoom = cluster.getClusterExpansionZoom(clusterId);
						currentMap.easeTo({center: coords, zoom: expansionZoom});
					});

					const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(currentMap);
					markersRef.current.set(markerId, marker);
				} else {
					// Update existing cluster marker position and count
					const marker = markersRef.current.get(markerId);
					marker.setLngLat(coords);
					marker.getElement().textContent = String(props.point_count);
				}
			} else {
				// Handle individual place marker
				const placeId = props.id;
				const markerId = `place-${placeId}`;
				currentMarkerIds.add(markerId);

				if (!markersRef.current.has(markerId)) {
					const place = filteredPlaces.find((p) => p.id === placeId);
					if (!place) continue;

					// Create marker element
					const el = document.createElement("div");
					el.className = "marker";
					el.style.backgroundImage = `url(${place.image})`;
					el.style.width = "40px";
					el.style.height = "40px";
					el.style.backgroundSize = "cover";
					el.style.borderRadius = "50%";
					el.style.border = "2px solid white";
					el.style.cursor = "pointer";
					el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

					// Add click listener to open detail panel
					el.addEventListener("click", (e) => {
						e.stopPropagation();
						handlePlaceClick(place);
					});

					// Create popup container
					const popupNode = document.createElement("div");
					const root = createRoot(popupNode);
					root.render(<MapPopup place={place} />);

					const popup = new mapboxgl.Popup({
						offset: 25,
						className: "custom-popup",
						maxWidth: "320px",
						anchor: "bottom",
						closeOnClick: false,
					}).setDOMContent(popupNode);

					const marker = new mapboxgl.Marker(el).setLngLat(coords).setPopup(popup).addTo(currentMap);
					markersRef.current.set(markerId, marker);
				}
			}
		}

		// Remove markers that are no longer visible
		for (const [id, marker] of markersRef.current.entries()) {
			if (!currentMarkerIds.has(id)) {
				marker.remove();
				markersRef.current.delete(id);
			}
		}
	}, [loaded, filteredPlaces, handlePlaceClick]);

	// Initialize supercluster and setup markers
	// biome-ignore lint/correctness/useExhaustiveDependencies: map.current is a ref that doesn't trigger re-renders
	useEffect(() => {
		if (!map.current || !loaded) return;

		const currentMap = map.current;

		// Clear existing markers
		for (const marker of markersRef.current.values()) {
			marker.remove();
		}
		markersRef.current.clear();

		// Initialize supercluster
		superclusterRef.current = new Supercluster({radius: 60, maxZoom: 14});

		// Load features into supercluster
		const features = placesToFeatures(filteredPlaces);
		superclusterRef.current.load(features);

		// Initial render of markers
		updateMarkers();

		// Update markers on map move/zoom
		const onMoveEnd = () => updateMarkers();
		currentMap.on("moveend", onMoveEnd);
		currentMap.on("zoomend", onMoveEnd);

		return () => {
			currentMap.off("moveend", onMoveEnd);
			currentMap.off("zoomend", onMoveEnd);
		};
	}, [loaded, filteredPlaces, updateMarkers]);

	// Handle navigation from chatbot with query params
	// biome-ignore lint/correctness/useExhaustiveDependencies: only trigger when map is loaded and places are available
	useEffect(() => {
		if (!loaded || places.length === 0) return;

		const placeId = searchParams.get("placeId");
		if (placeId) {
			const place = places.find((p) => p.id === Number(placeId));
			if (place) {
				// Delay to ensure markers are rendered
				setTimeout(() => {
					handlePlaceClick(place);
				}, 500);
				// Clear the query params after navigation
				window.history.replaceState({}, "", "/");
			}
		}
	}, [loaded, places, searchParams]);

	return (
		<div className="w-full h-screen flex flex-col bg-white">
			<Navbar />

			<div className="flex-1 flex relative overflow-hidden">
				<Sidebar
					searchOpen={searchOpen}
					setSearchOpen={(open) => {
						setSearchOpen(open);
						if (open) setJejakBudayaOpen(false);
					}}
					jejakBudayaOpen={jejakBudayaOpen}
					setJejakBudayaOpen={(open) => {
						setJejakBudayaOpen(open);
						if (open) {
							setSearchOpen(false);
							setFilterOpen(false);
						}
					}}
				/>

				{searchOpen && (
					<SearchPanel
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						filterOpen={filterOpen}
						setFilterOpen={(open) => {
							setFilterOpen(open);
							if (open) setSelectedPlace(null);
						}}
						filteredPlaces={filteredPlaces}
						handlePlaceClick={handlePlaceClick}
					/>
				)}

				{jejakBudayaOpen && <JejakBudaya places={places} onPlaceClick={flyToPlace} />}

				<div className="flex-1 relative">
					<div ref={mapContainer} className="w-full h-full" />

					{!loaded && (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
							<p className="text-gray-600">Loading map...</p>
						</div>
					)}

					{selectedPlace && (
						<PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} onUpdate={refreshPlaces} />
					)}

					<MapControls zoomIn={zoomIn} zoomOut={zoomOut} layerOpen={layerOpen} setLayerOpen={setLayerOpen} />

					{layerOpen && (
						<LayerModal
							isOpen={layerOpen}
							selectedMapStyle={mapStyle}
							onMapStyleChange={handleMapStyleChange}
							showPlaceLabels={showPlaceLabels}
							showRoadLabels={showRoadLabels}
							showPointOfInterestLabels={showPointOfInterestLabels}
							showTransitLabels={showTransitLabels}
							togglePlaceLabels={togglePlaceLabels}
							toggleRoadLabels={toggleRoadLabels}
							togglePointOfInterestLabels={togglePointOfInterestLabels}
							toggleTransitLabels={toggleTransitLabels}
						/>
					)}
				</div>

				{filterOpen && (
					<FilterPanel
						selectedCategory={selectedCategory}
						toggleCategory={toggleCategory}
						setSelectedCategory={setSelectedCategory}
						setFilterOpen={setFilterOpen}
					/>
				)}
			</div>
		</div>
	);
}

export default function MapBox3D() {
	return (
		<Suspense
			fallback={
				<div className="w-full h-screen flex items-center justify-center bg-gray-100">
					<p className="text-gray-600">Loading...</p>
				</div>
			}>
			<MapContent />
		</Suspense>
	);
}
