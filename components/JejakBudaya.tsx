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
		onPlaceClick(place);
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

				{/* Tabs */}
				<div className="pb-2">
					<div className="flex justify-between">
						{/* Visit Count */}
						<div className="px-4 py-2">
							<p className="text-sm text-gray-600">{totalVisits} Kunjungan</p>
						</div>
						<div className="flex gap-1 text-sm items-center px-2">
							Berdasarkan
							<button
								type="button"
								onClick={() => setActiveTab("tempat")}
								className={`px-3 py-1 rounded ${
									activeTab === "tempat" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}>
								Tempat
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("tanggal")}
								className={`px-3 py-1 rounded ${
									activeTab === "tanggal" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}>
								Tanggal
							</button>
						</div>
					</div>
				</div>

				{/* Places List */}
				<div className="flex-1 overflow-y-auto">
					{filteredPlaces.map((place) => (
						<button
							key={place.id}
							type="button"
							onClick={() => handlePlaceSelect(place)}
							className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-left transition-colors ${
								selectedPlace?.id === place.id ? "bg-yellow-50" : ""
							}`}>
							{/* Category Badge */}
							<div className="flex items-center gap-2 mb-2">
								<Building2 className="w-4 h-4 text-gray-600" />
								<span className="text-xs text-gray-600">{place.category}</span>
							</div>

							{/* Place Name */}
							<h3 className="font-semibold text-gray-800 mb-1">{place.name}</h3>

							{/* Location */}
							<div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
								<MapPin className="w-3 h-3" />
								<span>{place.location}</span>
							</div>

							{/* Place Image */}
							<div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
								<Image src={place.image} alt={place.name} fill className="object-cover" sizes="320px" />
							</div>

							{/* Events List */}
							{place.events.length > 0 && (
								<div className="space-y-2">
									{place.events.slice(0, 3).map((event, index) => (
										<div key={`${place.id}-${index}`} className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<p className="text-xs font-semibold text-gray-800">{event.date}</p>
												<p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
											</div>
											<button type="button" className="text-gray-400 hover:text-gray-600 shrink-0" aria-label="Lihat detail event">
												<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<title>Arrow</title>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</button>
										</div>
									))}
								</div>
							)}
						</button>
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
