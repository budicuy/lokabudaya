import Image from "next/image";

interface LayerModalProps {
	isOpen: boolean;
	selectedCategories: string[];
	onCategoryToggle: (category: string) => void;
	selectedMapStyle: string;
	onMapStyleChange: (style: string) => void;
}

export const LayerModal = ({
	isOpen,
	selectedCategories,
	onCategoryToggle,
	selectedMapStyle,
	onMapStyleChange,
}: LayerModalProps) => {
	if (!isOpen) return null;

	const categories = ["Benda", "Bangunan", "Situs", "Struktur", "Kawasan"];

	const mapStyles = [
		{id: "standard", name: "Standard", image: "/layer/standard.png", style: "mapbox://styles/mapbox/standard"},
		{id: "pudar", name: "Pudar", image: "/layer/pudar.png", style: "mapbox://styles/mapbox/light-v11"},
		{id: "satelit", name: "Satelit", image: "/layer/satelit.png", style: "mapbox://styles/mapbox/satellite-streets-v12"},
	];

	return (
		<div className="absolute top-44 right-4 w-64 bg-white rounded-lg shadow-xl z-20 p-4">
			{/* Header */}
			<div className="mb-4">
				<h3 className="font-semibold mb-1">Layer</h3>
				<p className="text-xs text-gray-500">Pilih item apa saja yang ingin ditampilkan</p>
			</div>

			{/* Kategori Section */}
			<div className="mb-4">
				<div className="flex items-center mb-3">
					<h4 className="text-sm font-medium">Kategori</h4>
					<div className="flex-1 ml-2 border-t-2 border-yellow-500" />
				</div>
				<div className="space-y-2">
					{categories.map((category) => (
						<label key={category} className="flex items-center gap-2 text-sm cursor-pointer">
							<input
								type="checkbox"
								checked={selectedCategories.includes(category)}
								onChange={() => onCategoryToggle(category)}
								className="w-4 h-4 accent-yellow-500 border-2 border-gray-300 rounded"
							/>
							<span>{category}</span>
						</label>
					))}
				</div>
			</div>

			{/* Citra Peta Section */}
			<div className="mb-4">
				<div className="flex items-center mb-3">
					<h4 className="text-sm font-medium">Citra Peta</h4>
					<div className="flex-1 ml-2 border-t-2 border-yellow-500" />
				</div>
				<div className="space-y-3">
					{mapStyles.map((style) => (
						<button
							key={style.id}
							type="button"
							onClick={() => onMapStyleChange(style.style)}
							className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
								selectedMapStyle === style.style ? "border-yellow-500 shadow-md" : "border-transparent hover:border-gray-300"
							}`}>
							<div className="relative w-full h-24">
								<Image
									src={style.image}
									alt={style.name}
									fill
									className="object-cover"
									sizes="(max-width: 256px) 100vw, 256px"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-2 py-1">
									<p className="text-sm font-medium text-gray-800">{style.name}</p>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
