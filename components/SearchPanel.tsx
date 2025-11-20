import {Building2, ListFilter, MapPin, Search, X} from "lucide-react";
import Image from "next/image";
import type {Place} from "@/types";

interface SearchPanelProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filterOpen: boolean;
	setFilterOpen: (open: boolean) => void;
	filteredPlaces: Place[];
	handlePlaceClick: (place: Place) => void;
}

export const SearchPanel = ({
	searchQuery,
	setSearchQuery,
	filterOpen,
	setFilterOpen,
	filteredPlaces,
	handlePlaceClick,
}: SearchPanelProps) => {
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="w-80 bg-white flex flex-col z-10 shadow-lg">
			<div className="p-4">
				<form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
					<Search className="w-4 h-4 text-gray-500" />
					<input
						type="text"
						placeholder="Tempat yang ingin dikunjungi.."
						className="bg-transparent outline-none text-sm flex-1"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					{searchQuery && (
						<button type="button" onClick={() => setSearchQuery("")}>
							<X className="w-4 h-4 text-gray-400" />
						</button>
					)}
					<div className="w-px h-4 bg-gray-300 mx-1" />
					<button
						type="button"
						onClick={() => setFilterOpen(!filterOpen)}
						className={`p-1 rounded transition-colors ${filterOpen ? "bg-yellow-100 text-yellow-600" : "text-gray-500 hover:bg-gray-200"}`}>
						<ListFilter className="w-4 h-4" />
					</button>
				</form>
			</div>

			<div className="px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
				<span>Hasil Pencarian ({filteredPlaces.length})</span>
			</div>

			<div className="flex-1 overflow-y-auto">
				{filteredPlaces.length === 0 ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-sm text-gray-500">Tidak ada hasil ditemukan</p>
					</div>
				) : (
					filteredPlaces.map((place) => (
						<button
							key={place.id}
							onClick={() => handlePlaceClick(place)}
							className="p-4 hover:bg-gray-50 cursor-pointer w-full text-left"
							type="button">
							<div className="flex gap-3">
								<Image
									src={place.image}
									alt={place.name}
									width={128}
									height={96}
									className="w-32 h-24 rounded-lg object-cover"
								/>
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
	);
};
