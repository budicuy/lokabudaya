"use client";

import {useState, useEffect, useCallback} from "react";
import {getAllPlaces, searchPlaces, getPlacesByCategory, deletePlace} from "@/app/actions/place";
import {CategoryValues, type Category, type Place} from "@/types/place";
import {Search, Pencil, Trash2, Eye, MapPin} from "lucide-react";
import Image from "next/image";

type PlacesContentProps = {initialPlaces: Place[]; onOpenForm: (place?: Place) => void};

export function PlacesContent({initialPlaces, onOpenForm}: PlacesContentProps) {
	const [places, setPlaces] = useState<Place[]>(initialPlaces);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
	const [deletingId, setDeletingId] = useState<number | null>(null);

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

	const handleDelete = async (id: number, name: string) => {
		if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
			return;
		}

		setDeletingId(id);

		try {
			const result = await deletePlace(id);

			if (result.success) {
				loadPlaces();
			} else {
				alert(result.error || "Gagal menghapus tempat");
			}
		} catch (error) {
			alert("Terjadi kesalahan saat menghapus");
			console.error(error);
		} finally {
			setDeletingId(null);
		}
	};

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
		<div className="space-y-6">
			{/* Search & Filter Bar */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<div className="flex flex-col lg:flex-row gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Cari tempat berdasarkan nama, lokasi, atau deskripsi..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>

					{/* Category Filter */}
					<div className="flex gap-2 flex-wrap">
						<button
							type="button"
							onClick={() => handleCategoryFilter("ALL")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								selectedCategory === "ALL"
									? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}>
							Semua
						</button>
						{Object.values(CategoryValues).map((category) => (
							<button
								key={category}
								type="button"
								onClick={() => handleCategoryFilter(category)}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									selectedCategory === category
										? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Places Grid */}
			{isLoading ? (
				<div className="flex justify-center items-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
				</div>
			) : places.length === 0 ? (
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
					<p className="text-gray-500 text-lg">Belum ada data tempat</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{places.map((place) => (
						<div
							key={place.id}
							className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
							{/* Image */}
							<div className="relative h-52 bg-linear-to-br from-gray-100 to-gray-200">
								<Image
									src={place.image}
									alt={place.name}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
									{place.category}
								</div>
							</div>

							{/* Content */}
							<div className="p-5">
								<h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{place.name}</h3>

								<div className="flex items-center text-gray-600 mb-3">
									<MapPin className="w-4 h-4 mr-1.5 shrink-0" />
									<span className="text-sm line-clamp-1">{place.location}</span>
								</div>

								<p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{place.description}</p>

								<div className="flex items-center text-gray-500 mb-4 pb-4 border-b border-gray-100">
									<Eye className="w-4 h-4 mr-1.5" />
									<span className="text-sm font-medium">{place.visitors.toLocaleString()} pengunjung</span>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => onOpenForm(place)}
										className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center justify-center gap-2">
										<Pencil className="w-4 h-4" />
										Edit
									</button>

									<button
										type="button"
										onClick={() => handleDelete(place.id, place.name)}
										disabled={deletingId === place.id}
										className="flex-1 bg-red-50 text-red-600 py-2.5 px-4 rounded-lg hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2">
										<Trash2 className="w-4 h-4" />
										{deletingId === place.id ? "Menghapus..." : "Hapus"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Stats Footer */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
				<div className="text-center">
					<p className="text-gray-600">
						Menampilkan <strong className="text-gray-800">{places.length}</strong> tempat budaya
					</p>
				</div>
			</div>
		</div>
	);
}
