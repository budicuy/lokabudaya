import {Camera, Landmark, MapPin, MoreVertical, Play, Users, X} from "lucide-react";
import Image from "next/image";
import {useState, useRef} from "react";
import {STATIC_PLACES} from "@/data/places";
import type {Place} from "@/types";

interface PlaceDetailProps {
	place: Place;
	onClose: () => void;
}

export const PlaceDetail = ({place, onClose}: PlaceDetailProps) => {
	const [activeTab, setActiveTab] = useState<"ringkasan" | "pengalaman">("ringkasan");
	const [isReviewing, setIsReviewing] = useState(false);

	const relatedPlacesData = place.relatedPlaces
		.map((id) => STATIC_PLACES.find((p) => p.id === id))
		.filter((p): p is Place => p !== undefined);

	const [uploadedMedia, setUploadedMedia] = useState<{type: "image" | "video"; src: string; file: File}[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newMedia = Array.from(e.target.files).map((file) => ({
				type: file.type.startsWith("video") ? "video" : ("image" as "image" | "video"),
				src: URL.createObjectURL(file),
				file,
			}));
			setUploadedMedia((prev) => [...prev, ...newMedia]);
		}
	};

	const handleRemoveMedia = (index: number) => {
		setUploadedMedia((prev) => {
			const newMedia = [...prev];
			URL.revokeObjectURL(newMedia[index].src);
			newMedia.splice(index, 1);
			return newMedia;
		});
	};

	if (isReviewing) {
		return (
			<div className="absolute left-0 top-0 bottom-0 w-[450px] bg-white border-l z-20 overflow-y-auto flex flex-col border-slate-200 animate-in slide-in-from-left-4 duration-300">
				{/* Header */}
				<div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
					<h2 className="text-xl font-bold text-gray-800">{place.name}</h2>
					<button
						onClick={() => setIsReviewing(false)}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						type="button">
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-4 flex-1 flex flex-col">
					{/* User Info */}
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
							<Image
								src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
								alt="John Doe"
								width={40}
								height={40}
								className="object-cover"
							/>
						</div>
						<div>
							<h3 className="font-bold text-gray-900 text-sm">John Doe</h3>
							<p className="text-xs text-gray-500">128 Kunjungan</p>
						</div>
					</div>

					{/* Text Area */}
					<textarea
						className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm text-gray-700 placeholder:text-gray-400 mb-4"
						placeholder="Ceritakan pengalamanmu mengunjungi tempat ini"
					/>

					{/* Upload Button */}
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						multiple
						accept="image/*,video/*"
						onChange={handleFileChange}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors mb-4">
						<Camera className="w-4 h-4" />
						Tambahkan foto atau video
					</button>

					{/* Media Preview Grid */}
					{uploadedMedia.length > 0 && (
						<div className="grid grid-cols-2 gap-2 mb-6">
							{uploadedMedia.map((media, idx) => (
								<div key={`media-${idx}`} className="relative aspect-video rounded-lg overflow-hidden group bg-gray-100">
									{media.type === "image" ? (
										<Image src={media.src} alt="Preview" fill className="object-cover" />
									) : (
										<video src={media.src} className="w-full h-full object-cover" />
									)}
									<button
										type="button"
										onClick={() => handleRemoveMedia(idx)}
										className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
										<X className="w-3 h-3" />
									</button>
									{media.type === "video" && (
										<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
											<div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
												<Play className="w-4 h-4 text-gray-900 fill-gray-900 ml-0.5" />
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Submit Button */}
					<div className="mt-auto">
						<button
							type="button"
							className="w-full bg-[#FDB813] hover:bg-[#E5A712] text-white font-bold py-3 rounded-lg transition-colors shadow-sm">
							Bagikan Pengalaman!
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="absolute left-0 top-0 bottom-0 w-[450px] bg-white border-l z-20 overflow-y-auto flex flex-col border-slate-200">
			{/* Header */}
			<div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
				<h2 className="text-xl font-bold text-gray-800">{place.name}</h2>
				<button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" type="button">
					<X className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<div className="p-4 space-y-6">
				{/* Meta Info */}
				<div className="flex items-center justify-between text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<Landmark className="w-4 h-4" />
						<span>{place.category}</span>
					</div>
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4" />
						<span>{place.visitors}</span>
					</div>
				</div>

				{/* Hero Image */}
				<div className="relative aspect-video rounded-xl overflow-hidden group">
					<Image src={place.image} alt={place.name} fill className="object-cover" />
					<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
				</div>

				{/* Action Button */}
				<button
					onClick={() => setIsReviewing(true)}
					className="w-full bg-[#5D4037] text-white py-3 rounded-lg font-medium hover:bg-[#4E342E] transition-colors flex items-center justify-center gap-2"
					type="button">
					Saya pernah berkunjung ke sini!
					<span>👣</span>
				</button>

				{/* Tabs */}
				<div className="flex border-b">
					<button
						className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
							activeTab === "ringkasan" ? "text-[#5D4037] border-b-2 border-[#5D4037]" : "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("ringkasan")}
						type="button">
						Ringkasan
					</button>
					<button
						className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
							activeTab === "pengalaman" ? "text-[#5D4037] border-b-2 border-[#5D4037]" : "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("pengalaman")}
						type="button">
						Pengalaman Pengunjung
					</button>
				</div>

				{/* Content */}
				{activeTab === "ringkasan" && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Address */}
						<div className="flex gap-3 items-start">
							<MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
							<p className="text-sm text-gray-600">{place.location}</p>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<h3 className="font-semibold text-gray-900">Deskripsi</h3>
							<p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>
						</div>

						{/* Events */}
						{place.events.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-semibold text-gray-900">Event yang sedang berlangsung!</h3>
								<div className="space-y-3">
									{place.events.map((event) => (
										<div key={event.title} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
											<div className="flex justify-between items-start mb-1">
												<h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
												<span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">{event.date}</span>
											</div>
											<p className="text-xs text-gray-600">{event.description}</p>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Related Places */}
						{relatedPlacesData.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-semibold text-gray-900">Tempat terkait</h3>
								<div className="grid grid-cols-2 gap-3">
									{relatedPlacesData.map((relatedPlace) => (
										<div key={relatedPlace.id} className="group cursor-pointer">
											<div className="aspect-4/3 relative rounded-lg overflow-hidden mb-2">
												<Image
													src={relatedPlace.image}
													alt={relatedPlace.name}
													fill
													className="object-cover group-hover:scale-110 transition-transform duration-300"
												/>
											</div>
											<div className="space-y-1">
												<div className="flex items-center gap-1 text-xs text-[#5D4037]">
													<Landmark className="w-3 h-3" />
													<span>{relatedPlace.category}</span>
												</div>
												<h4 className="font-medium text-sm text-gray-900 line-clamp-1">{relatedPlace.name}</h4>
												<p className="text-xs text-gray-500 line-clamp-1">{relatedPlace.location}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === "pengalaman" && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{place.reviews && place.reviews.length > 0 ? (
							place.reviews.map((review) => (
								<div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
									{/* Review Header */}
									<div className="flex justify-between items-start mb-2">
										<div className="flex gap-3">
											<div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
												<Image src={review.avatar} alt={review.user} width={40} height={40} className="object-cover" />
											</div>
											<div>
												<h4 className="font-semibold text-gray-900 text-sm">{review.user}</h4>
												<p className="text-xs text-gray-500">{review.visitCount} Kunjungan</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-xs text-gray-400">{review.date}</span>
											<button className="text-gray-400 hover:text-gray-600" type="button">
												<MoreVertical className="w-4 h-4" />
											</button>
										</div>
									</div>

									{/* Review Content */}
									<p className="text-sm text-gray-600 leading-relaxed mb-3">{review.content}</p>

									{/* Review Images */}
									{review.images && review.images.length > 0 && (
										<div className="grid grid-cols-2 gap-2 mt-3">
											{review.images.slice(0, 3).map((img, idx) => (
												<div
													key={img}
													className={`relative rounded-lg overflow-hidden ${
														idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
													}`}>
													<Image src={img} alt="Review" fill className="object-cover" />
													{idx === 2 && review.images.length > 3 && (
														<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
															<span className="text-white font-bold text-lg">+{review.images.length - 3}</span>
														</div>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							))
						) : (
							<div className="py-8 text-center text-gray-500">
								<p>Belum ada ulasan pengunjung.</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
