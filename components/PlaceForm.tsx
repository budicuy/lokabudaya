"use client";

import {useState} from "react";
import {createPlace, updatePlace} from "@/app/actions/place";
import type {CreatePlaceInput, UpdatePlaceInput} from "@/app/actions/place";
import {CategoryValues} from "@/types/place";

type PlaceFormProps = {mode: "create" | "update"; initialData?: UpdatePlaceInput; onSuccess?: () => void};

export default function PlaceForm({mode, initialData, onSuccess}: PlaceFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [formData, setFormData] = useState<CreatePlaceInput>({
		name: initialData?.name || "",
		category: initialData?.category || CategoryValues.Bangunan,
		location: initialData?.location || "",
		description: initialData?.description || "",
		visitors: initialData?.visitors || 0,
		image: initialData?.image || "",
		longitude: initialData?.longitude || 0,
		latitude: initialData?.latitude || 0,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const {name, value, type} = e.target;

		setFormData((prev) => ({...prev, [name]: type === "number" ? Number.parseFloat(value) || 0 : value}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			let result: {success: boolean; message?: string; error?: string; data?: unknown};

			if (mode === "create") {
				result = await createPlace(formData);
			} else {
				result = await updatePlace({id: initialData?.id || 0, ...formData});
			}

			if (result.success) {
				setSuccess(result.message || "Berhasil!");
				if (onSuccess) {
					onSuccess();
				}
				// Reset form jika mode create
				if (mode === "create") {
					setFormData({
						name: "",
						category: CategoryValues.Bangunan,
						location: "",
						description: "",
						visitors: 0,
						image: "",
						longitude: 0,
						latitude: 0,
					});
				}
			} else {
				setError(result.error || "Terjadi kesalahan");
			}
		} catch (err) {
			setError("Terjadi kesalahan yang tidak terduga");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">{mode === "create" ? "Tambah Tempat Baru" : "Edit Tempat"}</h2>

			{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

			{success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

			<div>
				<label htmlFor="name" className="block text-sm font-medium mb-2">
					Nama Tempat
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label htmlFor="category" className="block text-sm font-medium mb-2">
					Kategori
				</label>
				<select
					id="category"
					name="category"
					value={formData.category}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option value={CategoryValues.Bangunan}>Bangunan</option>
					<option value={CategoryValues.Situs}>Situs</option>
					<option value={CategoryValues.Struktur}>Struktur</option>
					<option value={CategoryValues.Kawasan}>Kawasan</option>
				</select>
			</div>

			<div>
				<label htmlFor="location" className="block text-sm font-medium mb-2">
					Lokasi
				</label>
				<input
					type="text"
					id="location"
					name="location"
					value={formData.location}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label htmlFor="description" className="block text-sm font-medium mb-2">
					Deskripsi
				</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					required
					rows={4}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="longitude" className="block text-sm font-medium mb-2">
						Longitude
					</label>
					<input
						type="number"
						id="longitude"
						name="longitude"
						value={formData.longitude}
						onChange={handleChange}
						required
						step="any"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label htmlFor="latitude" className="block text-sm font-medium mb-2">
						Latitude
					</label>
					<input
						type="number"
						id="latitude"
						name="latitude"
						value={formData.latitude}
						onChange={handleChange}
						required
						step="any"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="visitors" className="block text-sm font-medium mb-2">
					Jumlah Pengunjung
				</label>
				<input
					type="number"
					id="visitors"
					name="visitors"
					value={formData.visitors}
					onChange={handleChange}
					required
					min="0"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label htmlFor="image" className="block text-sm font-medium mb-2">
					URL Gambar
				</label>
				<input
					type="text"
					id="image"
					name="image"
					value={formData.image}
					onChange={handleChange}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
				{isLoading ? "Menyimpan..." : mode === "create" ? "Tambah Tempat" : "Perbarui Tempat"}
			</button>
		</form>
	);
}
