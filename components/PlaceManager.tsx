"use client";

import {useState, useEffect, useCallback} from "react";
import {getAllPlaces, searchPlaces, getPlacesByCategory} from "@/app/actions/place";
import type {UpdatePlaceInput} from "@/app/actions/place";
import {CategoryValues, type Category, type Place} from "@/types/place";
import PlaceForm from "@/components/PlaceForm";
import PlaceList from "@/components/PlaceList";
import {Plus, Search, X} from "lucide-react";

export default function PlaceManager() {
	const [places, setPlaces] = useState<Place[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingPlace, setEditingPlace] = useState<UpdatePlaceInput | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");

	const loadPlaces = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await getAllPlaces();
			if (result.success && result.data) {
				setPlaces(result.data);
			}
		} catch (error) {
			console.error("Error loading places:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleSearch = useCallback(async () => {
		if (!searchQuery.trim()) {
			loadPlaces();
			return;
		}

		setIsLoading(true);
		try {
			const result = await searchPlaces(searchQuery);
			if (result.success && result.data) {
				setPlaces(result.data);
			}
		} catch (error) {
			console.error("Error searching places:", error);
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, loadPlaces]);

	const handleCategoryFilter = async (category: Category | "ALL") => {
		setSelectedCategory(category);

		if (category === "ALL") {
			loadPlaces();
			return;
		}

		setIsLoading(true);
		try {
			const result = await getPlacesByCategory(category);
			if (result.success && result.data) {
				setPlaces(result.data);
			}
		} catch (error) {
			console.error("Error filtering places:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (place: Place) => {
		setEditingPlace(place);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingPlace(null);
		loadPlaces();
	};

	useEffect(() => {
		loadPlaces();
	}, [loadPlaces]);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchQuery) {
				handleSearch();
			} else {
				loadPlaces();
			}
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery, handleSearch, loadPlaces]);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold">Kelola Tempat Budaya</h1>
						<button
							type="button"
							onClick={() => {
								setEditingPlace(null);
								setShowForm(!showForm);
							}}
							className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
							{showForm ? (
								<>
									<X className="w-5 h-5" />
									Tutup Form
								</>
							) : (
								<>
									<Plus className="w-5 h-5" />
									Tambah Tempat
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Form Section */}
			{showForm && (
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="bg-white rounded-lg shadow-md p-6">
						<PlaceForm
							mode={editingPlace ? "update" : "create"}
							initialData={editingPlace || undefined}
							onSuccess={handleCloseForm}
						/>
					</div>
				</div>
			)}

			{/* Filters Section */}
			<div className="max-w-7xl mx-auto px-6 py-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Cari tempat berdasarkan nama, lokasi, atau deskripsi..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
									<X className="w-5 h-5" />
								</button>
							)}
						</div>

						{/* Category Filter */}
						<div className="flex gap-2 flex-wrap">
							<button
								type="button"
								onClick={() => handleCategoryFilter("ALL")}
								className={`px-4 py-2 rounded-md transition-colors ${
									selectedCategory === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								Semua
							</button>
							{Object.values(CategoryValues).map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => handleCategoryFilter(category)}
									className={`px-4 py-2 rounded-md transition-colors ${
										selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}>
									{category}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Places List */}
			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
				</div>
			) : (
				<PlaceList places={places} onEdit={handleEdit} onRefresh={loadPlaces} />
			)}

			{/* Stats Footer */}
			<div className="max-w-7xl mx-auto px-6 py-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="text-center text-gray-600">
						Total: <strong>{places.length}</strong> tempat budaya
					</div>
				</div>
			</div>
		</div>
	);
}
