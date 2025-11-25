"use server";

import {prisma} from "@/lib/prisma";
import type {Category} from "@/prisma/generated/client";
import {revalidatePath} from "next/cache";
import {del} from "@vercel/blob";

// Type untuk input Create Place
export type CreatePlaceInput = {
	name: string;
	category: Category;
	location: string;
	description: string;
	visitors: number;
	image: string;
	longitude: number;
	latitude: number;
};

// Type untuk input Update Place
export type UpdatePlaceInput = {
	id: number;
	name?: string;
	category?: Category;
	location?: string;
	description?: string;
	visitors?: number;
	image?: string;
	longitude?: number;
	latitude?: number;
};

/**
 * Get all places
 * @returns Array of all places
 */
export async function getAllPlaces() {
	try {
		const places = await prisma.place.findMany({
			include: {events: true, reviews: {orderBy: {date: "desc"}}},
			orderBy: {id: "desc"},
		});

		return {success: true, data: places};
	} catch (error) {
		console.error("Error getting all places:", error);
		return {success: false, error: "Gagal mengambil data tempat"};
	}
}

/**
 * Get place by ID
 * @param id - Place ID
 * @returns Place data or null
 */
export async function getPlaceById(id: number) {
	try {
		const place = await prisma.place.findUnique({
			where: {id},
			include: {events: true, reviews: {orderBy: {date: "desc"}}},
		});

		if (!place) {
			return {success: false, error: "Tempat tidak ditemukan"};
		}

		return {success: true, data: place};
	} catch (error) {
		console.error("Error getting place by ID:", error);
		return {success: false, error: "Gagal mengambil data tempat"};
	}
}

/**
 * Create new place
 * @param input - Place data
 * @returns Created place
 */
export async function createPlace(input: CreatePlaceInput) {
	try {
		const place = await prisma.place.create({
			data: {
				name: input.name,
				category: input.category,
				location: input.location,
				description: input.description,
				visitors: input.visitors,
				image: input.image,
				longitude: input.longitude,
				latitude: input.latitude,
			},
			include: {events: true, reviews: true},
		});

		// Revalidate path untuk update cache
		revalidatePath("/");
		revalidatePath("/dashboard");

		return {success: true, data: place, message: "Tempat berhasil ditambahkan"};
	} catch (error) {
		console.error("Error creating place:", error);
		return {success: false, error: "Gagal menambahkan tempat"};
	}
}

/**
 * Update existing place
 * @param input - Place data to update
 * @returns Updated place
 */
export async function updatePlace(input: UpdatePlaceInput) {
	try {
		// Cek apakah place exists
		const existingPlace = await prisma.place.findUnique({where: {id: input.id}});

		if (!existingPlace) {
			return {success: false, error: "Tempat tidak ditemukan"};
		}

		// Delete old image if new image is provided and different
		if (input.image && input.image !== existingPlace.image) {
			if (existingPlace.image?.includes("public.blob.vercel-storage.com")) {
				try {
					await del(existingPlace.image);
				} catch (e) {
					console.error("Failed to delete old image:", e);
				}
			}
		}

		// Prepare update data (hanya field yang ada)
		const updateData: Partial<CreatePlaceInput> = {};

		if (input.name !== undefined) updateData.name = input.name;
		if (input.category !== undefined) updateData.category = input.category;
		if (input.location !== undefined) updateData.location = input.location;
		if (input.description !== undefined) updateData.description = input.description;
		if (input.visitors !== undefined) updateData.visitors = input.visitors;
		if (input.image !== undefined) updateData.image = input.image;
		if (input.longitude !== undefined) updateData.longitude = input.longitude;
		if (input.latitude !== undefined) updateData.latitude = input.latitude;

		const place = await prisma.place.update({
			where: {id: input.id},
			data: updateData,
			include: {events: true, reviews: true},
		});

		// Revalidate path untuk update cache
		revalidatePath("/");
		revalidatePath("/dashboard");
		revalidatePath(`/detail/${input.id}`);

		return {success: true, data: place, message: "Tempat berhasil diperbarui"};
	} catch (error) {
		console.error("Error updating place:", error);
		return {success: false, error: "Gagal memperbarui tempat"};
	}
}

/**
 * Delete place
 * @param id - Place ID to delete
 * @returns Success status
 */
export async function deletePlace(id: number) {
	try {
		// Cek apakah place exists
		const existingPlace = await prisma.place.findUnique({where: {id}});

		if (!existingPlace) {
			return {success: false, error: "Tempat tidak ditemukan"};
		}

		// Delete image from blob storage if it exists
		if (existingPlace.image?.includes("public.blob.vercel-storage.com")) {
			try {
				await del(existingPlace.image);
			} catch (e) {
				console.error("Failed to delete image:", e);
			}
		}

		// Delete place (akan cascade delete events dan reviews)
		await prisma.place.delete({where: {id}});

		// Revalidate path untuk update cache
		revalidatePath("/");
		revalidatePath("/dashboard");

		return {success: true, message: "Tempat berhasil dihapus"};
	} catch (error) {
		console.error("Error deleting place:", error);
		return {success: false, error: "Gagal menghapus tempat"};
	}
}

/**
 * Search places by name or location
 * @param query - Search query
 * @returns Array of matching places
 */
export async function searchPlaces(query: string) {
	try {
		const places = await prisma.place.findMany({
			where: {OR: [{name: {contains: query}}, {location: {contains: query}}, {description: {contains: query}}]},
			include: {events: true, reviews: {orderBy: {date: "desc"}}},
			orderBy: {id: "desc"},
		});

		return {success: true, data: places};
	} catch (error) {
		console.error("Error searching places:", error);
		return {success: false, error: "Gagal mencari tempat"};
	}
}

/**
 * Get places by category
 * @param category - Category filter
 * @returns Array of places in category
 */
export async function getPlacesByCategory(category: Category) {
	try {
		const places = await prisma.place.findMany({
			where: {category},
			include: {events: true, reviews: {orderBy: {date: "desc"}}},
			orderBy: {visitors: "desc"},
		});

		return {success: true, data: places};
	} catch (error) {
		console.error("Error getting places by category:", error);
		return {success: false, error: "Gagal mengambil data tempat berdasarkan kategori"};
	}
}

/**
 * Increment visitor count
 * @param id - Place ID
 * @returns Updated place
 */
export async function incrementVisitorCount(id: number) {
	try {
		const place = await prisma.place.update({where: {id}, data: {visitors: {increment: 1}}});

		revalidatePath("/");
		revalidatePath(`/detail/${id}`);

		return {success: true, data: place};
	} catch (error) {
		console.error("Error incrementing visitor count:", error);
		return {success: false, error: "Gagal memperbarui jumlah pengunjung"};
	}
}

/**
 * Import places from CSV content
 * @param csvContent - Raw CSV string
 * @returns Import result
 */
export async function importPlacesFromCsv(csvContent: string) {
	try {
		const lines = csvContent.split(/\r?\n/);
		if (lines.length < 2) {
			return {success: false, error: "CSV kosong atau tidak valid"};
		}

		const headers = lines[0]
			.toLowerCase()
			.split(",")
			.map((h) => h.trim().replace(/"/g, ""));
		let successCount = 0;
		let failCount = 0;

		// Helper to parse CSV line handling quotes
		const parseLine = (text: string) => {
			const result = [];
			let cur = "";
			let inQuote = false;
			for (let i = 0; i < text.length; i++) {
				const char = text[i];
				if (inQuote) {
					if (char === '"') {
						if (i + 1 < text.length && text[i + 1] === '"') {
							cur += '"';
							i++;
						} else {
							inQuote = false;
						}
					} else {
						cur += char;
					}
				} else {
					if (char === '"') {
						inQuote = true;
					} else if (char === ",") {
						result.push(cur.trim());
						cur = "";
					} else {
						cur += char;
					}
				}
			}
			result.push(cur.trim());
			return result;
		};

		for (let i = 1; i < lines.length; i++) {
			const line = lines[i];
			if (!line.trim()) continue;

			try {
				const values = parseLine(line);
				const data: any = {};

				headers.forEach((header, index) => {
					if (values[index] !== undefined) {
						let value: any = values[index];

						// Convert types based on header
						if (header === "visitors") value = parseInt(value) || 0;
						if (header === "longitude" || header === "latitude") value = parseFloat(value) || 0;

						// Map common header names to schema fields
						if (header === "lat") data.latitude = parseFloat(value) || 0;
						else if (header === "lng" || header === "long") data.longitude = parseFloat(value) || 0;
						else data[header] = value;
					}
				});

				// Validate required fields
				if (!data.name || !data.category) {
					failCount++;
					continue;
				}

				// Ensure category is valid enum
				const validCategories = ["Bangunan", "Situs", "Struktur", "Kawasan"];
				if (!validCategories.includes(data.category)) {
					// Try to match case insensitive or default to Bangunan
					const match = validCategories.find((c) => c.toLowerCase() === data.category.toLowerCase());
					data.category = match || "Bangunan";
				}

				await prisma.place.create({
					data: {
						name: data.name,
						category: data.category as Category,
						location: data.location || "",
						description: data.description || "",
						visitors: data.visitors || 0,
						image: data.image || "",
						longitude: data.longitude || 0,
						latitude: data.latitude || 0,
					},
				});

				successCount++;
			} catch (err) {
				console.error(`Failed to import line ${i + 1}:`, err);
				failCount++;
			}
		}

		revalidatePath("/");
		revalidatePath("/dashboard");

		return {success: true, count: successCount, message: `Berhasil import ${successCount} tempat. Gagal: ${failCount}`};
	} catch (error) {
		console.error("Error importing CSV:", error);
		return {success: false, error: "Gagal memproses file CSV"};
	}
}
