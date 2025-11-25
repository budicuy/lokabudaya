"use client";

import {useState} from "react";
import Image from "next/image";
import {deletePlace, incrementVisitorCount} from "@/app/actions/place";
import type {Category} from "@/types/place";
import {Trash2, Eye, MapPin, Edit} from "lucide-react";

type Place = {
	id: number;
	name: string;
	category: Category;
	location: string;
	description: string;
	visitors: number;
	image: string;
	longitude: number;
	latitude: number;
};

type PlaceListProps = {places: Place[]; onEdit?: (place: Place) => void; onRefresh?: () => void};

export default function PlaceList({places, onEdit, onRefresh}: PlaceListProps) {
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const handleDelete = async (id: number, name: string) => {
		if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
			return;
		}

		setDeletingId(id);

		try {
			const result = await deletePlace(id);

			if (result.success) {
				alert(result.message);
				if (onRefresh) {
					onRefresh();
				}
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

	const handleIncrementVisitor = async (id: number) => {
		try {
			const result = await incrementVisitorCount(id);

			if (result.success) {
				if (onRefresh) {
					onRefresh();
				}
			}
		} catch (error) {
			console.error("Error incrementing visitor:", error);
		}
	};

	if (places.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">Belum ada data tempat</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			{places.map((place) => (
				<div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
					<div className="relative h-48 bg-gray-200">
						<Image
							src={place.image}
							alt={place.name}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
						<span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
							{place.category}
						</span>
					</div>

					<div className="p-4">
						<h3 className="text-xl font-bold mb-2">{place.name}</h3>

						<div className="flex items-center text-gray-600 mb-2">
							<MapPin className="w-4 h-4 mr-1" />
							<span className="text-sm">{place.location}</span>
						</div>

						<p className="text-gray-700 text-sm mb-4 line-clamp-2">{place.description}</p>

						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center text-gray-600">
								<Eye className="w-4 h-4 mr-1" />
								<span className="text-sm">{place.visitors.toLocaleString()} pengunjung</span>
							</div>
							<button
								type="button"
								onClick={() => handleIncrementVisitor(place.id)}
								className="text-xs text-blue-600 hover:text-blue-800">
								+ Tambah
							</button>
						</div>

						<div className="flex gap-2">
							{onEdit && (
								<button
									type="button"
									onClick={() => onEdit(place)}
									className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
									<Edit className="w-4 h-4" />
									Edit
								</button>
							)}

							<button
								type="button"
								onClick={() => handleDelete(place.id, place.name)}
								disabled={deletingId === place.id}
								className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
								<Trash2 className="w-4 h-4" />
								{deletingId === place.id ? "Menghapus..." : "Hapus"}
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
