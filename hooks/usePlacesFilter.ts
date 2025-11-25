import {useState, useEffect} from "react";
import {getAllPlaces} from "@/app/actions/place";
import type {Place} from "@/types";

export const usePlacesFilter = () => {
	const [places, setPlaces] = useState<Place[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchPlaces = async () => {
		setIsLoading(true);
		try {
			const result = await getAllPlaces();
			if (result.success && result.data) {
				const mappedPlaces: Place[] = result.data.map((p: any) => ({
					...p,
					coordinates: [p.longitude, p.latitude] as [number, number],
				}));
				setPlaces(mappedPlaces);
			}
		} catch (error) {
			console.error("Failed to fetch places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlaces();
	}, []);

	const refreshPlaces = () => {
		fetchPlaces();
	};

	const filteredPlaces = places.filter((place) => {
		const matchesSearch =
			!searchQuery ||
			place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			place.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory = !selectedCategory || place.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	const toggleCategory = (category: string) => {
		setSelectedCategory(selectedCategory === category ? null : category);
	};

	return {
		places,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		filteredPlaces,
		toggleCategory,
		isLoading,
		refreshPlaces,
	};
};
