"use client";

import {ArrowLeft, Building2, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {notFound, useParams} from "next/navigation";
import {Sidebar} from "@/components/Sidebar";
import {STATIC_PLACES} from "@/data/places";

export default function DetailPage() {
	const params = useParams();
	const id = Number(params.id);

	const place = STATIC_PLACES.find((p) => p.id === id);

	if (!place) {
		notFound();
	}

	// Duplicate images for gallery (in real app, you'd have multiple images)
	const galleryImages = [place.image, place.image, place.image, place.image];

	return (
		<div className="w-full h-screen flex bg-white">
			{/* Sidebar */}
			<Sidebar searchOpen={false} setSearchOpen={() => {}} />

			{/* Main Content */}
			<div className="flex-1 overflow-y-auto">
				{/* Header */}
				<header className="border-b border-gray-200 bg-white sticky top-0 z-10 px-8 py-4">
					<div className="flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm">
							<ArrowLeft className="w-4 h-4" />
							<span>Kembali ke peta</span>
						</Link>
						<div className="flex items-center gap-6 text-sm text-gray-600">
							<button type="button" className="hover:text-gray-900">
								Menu
							</button>
							<button type="button" className="hover:text-gray-900">
								Menu
							</button>
						</div>
					</div>
				</header>

				{/* Content */}
				<main className="px-8 py-6">
					{/* Title & Address */}
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
						<p className="text-sm text-gray-600">{place.location}</p>
					</div>

					{/* Main Layout: Image + Gallery */}
					<div className="flex gap-4 mb-6">
						{/* Main Image */}
						<div className="flex-1">
							<div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
								<Image src={place.image} alt={place.name} fill className="object-cover" priority />
							</div>
						</div>

						{/* Thumbnail Gallery */}
						<div className="w-[200px] flex flex-col gap-3">
							{galleryImages.map((img, idx) => (
								<div
									key={`gallery-${
										// biome-ignore lint/suspicious/noArrayIndexKey: Static gallery display
										idx
									}`}
									className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
									<Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" sizes="200px" />
								</div>
							))}
						</div>
					</div>

					{/* Meta Info */}
					<div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
						<div className="flex items-center gap-2 text-sm">
							<Building2 className="w-4 h-4 text-gray-700" />
							<span className="text-gray-900 font-medium">{place.category}</span>
						</div>
						<div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
							<Users className="w-4 h-4 text-orange-600" />
							<span className="text-sm font-medium text-orange-900">{place.visitors.split(" ")[0]}+ Kontributor</span>
						</div>
					</div>

					{/* Description */}
					<div className="mb-8">
						<p className="text-gray-700 leading-relaxed mb-4">{place.description}</p>
						<p className="text-gray-700 leading-relaxed mb-2">
							Monumen Nasional yang disingkat dengan Monas atau Tugu Monas adalah monumen peringatan setinggi 132 meter (433
							kaki), terletak tepat di tengah Lapangan Medan Merdeka, Jakarta Pusat. Monas didirikan untuk mengenang perlawanan
							dan perjuangan rakyat Indonesia dalam merebut kemerdekaan dari pemerintahan kolonial Kerajaan Belanda.
						</p>
						<Link
							href="https://id.wikipedia.org/wiki/Monumen_Nasional"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 underline text-sm">
							Wikipedia
						</Link>
					</div>

					{/* Events Section */}
					{place.events && place.events.length > 0 && (
						<div className="mb-8">
							<h2 className="text-xl font-bold text-gray-900 mb-4">Event yang sedang berlangsung!</h2>
							<div className="space-y-3">
								{place.events.map((event) => (
									<div
										key={event.title}
										className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow">
										{/* Event Image */}
										<div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-yellow-100">
											<Image src={place.image} alt={event.title} width={80} height={80} className="object-cover w-full h-full" />
										</div>

										{/* Event Content */}
										<div className="flex-1">
											<h3 className="font-bold text-gray-900 text-sm mb-1">{event.title}</h3>
											<p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
											<div className="flex items-center justify-between">
												<span className="text-xs text-gray-500">Baru hari ini</span>
												<span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-yellow-300">
													{event.date}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
