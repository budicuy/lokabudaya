import {Grid3x3, Landmark, MapPinned} from "lucide-react";

interface FilterPanelProps {
	selectedCategory: string | null;
	toggleCategory: (category: string) => void;
	setSelectedCategory: (category: string | null) => void;
	setFilterOpen: (open: boolean) => void;
}

export const FilterPanel = ({
	selectedCategory,
	toggleCategory,
	setSelectedCategory,
	setFilterOpen,
}: FilterPanelProps) => {
	return (
		<div className="absolute left-96 top-0 w-64 bg-white rounded-lg shadow-xl z-20 m-4 p-4">
			<div className="mb-4">
				<h3 className="font-semibold mb-1">Filter</h3>
				<p className="text-xs text-gray-500">Filter konten untuk menyesuaikan pencarian</p>
			</div>

			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<h4 className="text-sm font-medium">Urutkan</h4>
					<button className="text-xs text-blue-600" type="button">
						Pilih semua
					</button>
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
						onClick={() => toggleCategory("Bangunan")}
						className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
							selectedCategory === "Bangunan" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"
						}`}
						type="button">
						<Landmark className="w-3 h-3" />
						Bangunan
					</button>
					<button
						onClick={() => toggleCategory("Situs")}
						className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
							selectedCategory === "Situs" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"
						}`}
						type="button">
						<MapPinned className="w-3 h-3" />
						Situs
					</button>
					<button
						onClick={() => toggleCategory("Kawasan")}
						className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
							selectedCategory === "Kawasan" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"
						}`}
						type="button">
						Kawasan
					</button>
					<button
						onClick={() => toggleCategory("Struktur")}
						className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
							selectedCategory === "Struktur" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"
						}`}
						type="button">
						<Grid3x3 className="w-3 h-3" />
						Struktur
					</button>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => setSelectedCategory(null)}
					className="flex-1 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
					type="button">
					Atur ulang
				</button>
				<button
					onClick={() => setFilterOpen(false)}
					className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
					type="button">
					Terapkan
				</button>
			</div>
		</div>
	);
};
