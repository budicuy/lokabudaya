"use client";

import {useState, useRef, useEffect} from "react";
import {createPlace, updatePlace} from "@/app/actions/place";
import type {CreatePlaceInput} from "@/app/actions/place";
import {CategoryValues, type Place} from "@/types/place";
import {X, Upload, Image as ImageIcon} from "lucide-react";
import Image from "next/image";

type PlaceFormModalProps = {isOpen: boolean; onClose: () => void; place?: Place; onSuccess: () => void};

export function PlaceFormModal({isOpen, onClose, place, onSuccess}: PlaceFormModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(place?.image || null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState<CreatePlaceInput>({
		name: "",
		category: CategoryValues.Bangunan,
		location: "",
		description: "",
		visitors: 0,
		image: "",
		longitude: 0,
		latitude: 0,
	});

	// Reset/Populate form when modal opens or place changes
	useEffect(() => {
		if (isOpen) {
			if (place) {
				setFormData({
					name: place.name,
					category: place.category,
					location: place.location,
					description: place.description,
					visitors: place.visitors,
					image: place.image,
					longitude: place.longitude,
					latitude: place.latitude,
				});
				setPreviewUrl(place.image);
			} else {
				// Reset for create mode
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
				setPreviewUrl(null);
			}
			setFile(null);
			setError(null);
		}
	}, [isOpen, place]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const {name, value, type} = e.target;
		setFormData((prev) => ({...prev, [name]: type === "number" ? Number.parseFloat(value) || 0 : value}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);

			// Create preview URL
			const objectUrl = URL.createObjectURL(selectedFile);
			setPreviewUrl(objectUrl);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			let imageUrl = formData.image;

			// Upload file if selected
			if (file) {
				const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {method: "POST", body: file});

				if (!response.ok) {
					throw new Error("Gagal mengupload gambar");
				}

				const blob = await response.json();
				imageUrl = blob.url;
			}

			// Update form data with new image URL
			const dataToSubmit = {...formData, image: imageUrl};

			let result: {success: boolean; message?: string; error?: string; data?: unknown};

			if (place) {
				// Update
				result = await updatePlace({id: place.id, ...dataToSubmit});
			} else {
				// Create
				result = await createPlace(dataToSubmit);
			}

			if (result.success) {
				onSuccess();
				onClose();
			} else {
				setError(result.error || "Terjadi kesalahan");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
					<h2 className="text-2xl font-bold text-gray-800">{place ? "Edit Tempat" : "Tambah Tempat Baru"}</h2>
					<button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

					{/* Nama Tempat */}
					<div>
						<label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
							Nama Tempat
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							placeholder="Contoh: Candi Borobudur"
						/>
					</div>

					{/* Kategori */}
					<div>
						<label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
							Kategori
						</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							required
							className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
							<option value={CategoryValues.Bangunan}>Bangunan</option>
							<option value={CategoryValues.Situs}>Situs</option>
							<option value={CategoryValues.Struktur}>Struktur</option>
							<option value={CategoryValues.Kawasan}>Kawasan</option>
						</select>
					</div>

					{/* Lokasi */}
					<div>
						<label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
							Lokasi
						</label>
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							required
							className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							placeholder="Contoh: Magelang, Jawa Tengah"
						/>
					</div>

					{/* Deskripsi */}
					<div>
						<label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
							Deskripsi
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							rows={4}
							className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
							placeholder="Jelaskan tentang tempat ini..."
						/>
					</div>

					{/* Koordinat */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
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
								className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
								placeholder="110.2038"
							/>
						</div>

						<div>
							<label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
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
								className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
								placeholder="-7.6079"
							/>
						</div>
					</div>

					{/* Visitors & Image Upload */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="visitors" className="block text-sm font-semibold text-gray-700 mb-2">
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
								className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
								placeholder="0"
							/>
						</div>

						<div>
							<span className="block text-sm font-semibold text-gray-700 mb-2">Gambar Tempat</span>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-50 transition-colors relative h-[120px] overflow-hidden group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileChange}
									accept="image/*"
									className="hidden"
									aria-label="Upload gambar tempat"
								/>

								{previewUrl ? (
									<>
										<Image src={previewUrl} alt="Preview" fill className="object-cover rounded-lg" />
										<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<div className="bg-white p-2 rounded-full">
												<Upload className="w-5 h-5 text-gray-700" />
											</div>
										</div>
									</>
								) : (
									<>
										<ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
										<p className="text-sm text-gray-500 text-center">Klik untuk upload gambar</p>
									</>
								)}
							</button>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
							Batal
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium shadow-lg shadow-yellow-500/30 transition-colors flex items-center justify-center gap-2">
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>{file ? "Mengupload..." : "Menyimpan..."}</span>
								</>
							) : (
								<span>{place ? "Simpan Perubahan" : "Tambah Tempat"}</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
