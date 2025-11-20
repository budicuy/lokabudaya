import {useState} from "react";
import {STATIC_PLACES} from "@/data/places";

export const usePlacesFilter = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const filteredPlaces = STATIC_PLACES.filter((place) => {
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

	return {searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, filteredPlaces, toggleCategory};
};
