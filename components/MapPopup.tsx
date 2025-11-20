import {ArrowRight, Landmark, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type {Place} from "@/types";

interface MapPopupProps {
	place: Place;
}

export const MapPopup = ({place}: MapPopupProps) => {
	return (
		<div className="w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden font-sans hover:shadow-2xl transition-shadow duration-300">
			<div className="relative aspect-video w-full overflow-hidden">
				<Image
					src={place.image}
					alt={place.name}
					fill
					className="object-cover hover:scale-105 transition-transform duration-300"
				/>
			</div>
			<div className="p-5">
				<h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{place.name}</h3>
				<p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{place.description}</p>

				<div className="flex items-center justify-between text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-lg">
					<div className="flex items-center gap-2">
						<Landmark className="w-4 h-4 text-amber-700" />
						<span className="font-medium">{place.category}</span>
					</div>
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-amber-700" />
						<span className="font-medium">{place.visitors.split(" ")[0]}</span>
					</div>
				</div>

				<Link
					href={`/detail/${place.id}`}
					className="w-full bg-gradient-to-r from-[#5D4037] to-[#6D4C41] text-white py-3 rounded-xl text-sm font-semibold hover:from-[#4E342E] hover:to-[#5D4037] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
					Lihat Detail
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</div>
	);
};
