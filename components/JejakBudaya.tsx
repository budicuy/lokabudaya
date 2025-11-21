import {Building2, MapPin, MessageCircle, Search, X} from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import type {Place} from "@/types";

interface JejakBudayaProps {
	places: Place[];
	onPlaceClick: (place: Place) => void;
}

export const JejakBudaya = ({places, onPlaceClick}: JejakBudayaProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"berdasarkan" | "tempat" | "tanggal">("berdasarkan");
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

	// Filter places berdasarkan search query
	const filteredPlaces = places.filter((place) => place.name.toLowerCase().includes(searchQuery.toLowerCase()));

	// Simulasi data kunjungan - dalam aplikasi real, ini dari database
	const totalVisits = 20;

	const handlePlaceSelect = (place: Place) => {
		setSelectedPlace(place);
		setTimeout(() => {
			onPlaceClick(place);
		}, 100);
	};

	return (
		<div className="flex h-full z-20 shadow-xl">
			{/* Left Panel - Jejak Budayaku List */}
			<div className="w-120 bg-white border-r border-gray-200 flex flex-col h-full">
				{/* Header */}
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">Jejak Budayaku</h2>
				</div>

				{/* Search */}
				<div className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Cari tempat"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
						/>
					</div>
				</div>

				{/* Tabs & Count Header */}
				<div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
					<p className="text-xs text-gray-500 font-medium">{totalVisits} Kunjungan</p>
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-400">Berdasarkan</span>
						<div className="flex bg-gray-100 p-1 rounded-lg">
							<button
								type="button"
								onClick={() => setActiveTab("tempat")}
								className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
									activeTab === "tempat" ? "bg-[#5C4033] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
								}`}>
								Tempat
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("tanggal")}
								className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
									activeTab === "tanggal" ? "bg-[#5C4033] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
								}`}>
								Tanggal
							</button>
						</div>
					</div>
				</div>

				{/* Places List */}
				<div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
					{filteredPlaces.map((place) => (
						<div
							key={place.id}
							onClick={() => handlePlaceSelect(place)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handlePlaceSelect(place);
								}
							}}
							tabIndex={0}
							className={`w-full bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
								selectedPlace?.id === place.id ? "border-yellow-500 ring-1 ring-yellow-500" : "border-gray-200"
							}`}>
							{/* Header Card */}
							<div className="mb-3">
								<div className="flex items-center gap-2 mb-1">
									<Building2 className="w-3.5 h-3.5 text-[#8B5E3C]" />
									<span className="text-xs font-bold text-[#8B5E3C]">{place.category}</span>
								</div>
								<h3 className="text-base font-bold text-gray-900 mb-1">{place.name}</h3>
								<div className="flex items-center gap-1 text-xs text-gray-500">
									<MapPin className="w-3.5 h-3.5" />
									<span>{place.location}</span>
								</div>
							</div>

							{/* Image */}
							<div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
								<Image
									src={place.image}
									alt={place.name}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 320px"
								/>
							</div>

							{/* Events List */}
							{place.events.length > 0 && (
								<div className="space-y-1">
									{place.events.slice(0, 3).map((event, index) => (
										<div
											key={`${place.id}-${index}`}
											className={`flex items-center justify-between gap-3 ${
												index === 0 ? "bg-gray-100 p-3 rounded-xl mb-2" : "py-3 border-t border-dashed border-gray-200"
											}`}>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-bold text-gray-900">{event.date}</p>
												<p className="text-xs text-gray-500 truncate">{event.description}</p>
											</div>
											<div className="text-gray-400 shrink-0">
												<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<title>Arrow Right</title>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Right Panel - Detail Place (Conditional) */}
			{selectedPlace && (
				<div className="w-[450px] bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
					<div className="p-6 h-full overflow-y-auto">
						{/* Header with Close Button */}
						<div className="flex justify-between items-start mb-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPlace.name}</h2>
								<div className="flex items-center gap-1 text-sm text-gray-500">
									<MapPin className="w-4 h-4" />
									<span>{selectedPlace.location}</span>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setSelectedPlace(null)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
								<X className="w-5 h-5 text-gray-600" />
							</button>
						</div>

						{/* Reviews */}
						{selectedPlace.reviews.length > 0 ? (
							<div className="space-y-6">
								{selectedPlace.reviews.map((review) => (
									<div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
										{/* Review Header */}
										<div className="flex items-start gap-3 mb-4">
											<div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shrink-0">
												<Image src={review.avatar} alt={review.user} width={48} height={48} className="w-full h-full" />
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<h4 className="font-semibold text-gray-800">{review.user}</h4>
													<span className="text-xs text-gray-500">{review.date}</span>
												</div>
												<p className="text-xs text-gray-500">{review.visitCount} kunjungan</p>
											</div>
										</div>

										{/* Review Content */}
										<p className="text-sm text-gray-700 mb-4 leading-relaxed">{review.content}</p>

										{/* Review Images Grid */}
										{review.images.length > 0 && (
											<div className="grid grid-cols-2 gap-3">
												{review.images.map((img, idx) => (
													<div key={`${review.id}-img-${idx}`} className="relative aspect-video rounded-lg overflow-hidden">
														<Image src={img} alt={`Review ${idx + 1}`} fill className="object-cover" sizes="400px" />
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-16 text-gray-400">
								<MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
								<p className="text-lg">Belum ada ulasan untuk tempat ini</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
