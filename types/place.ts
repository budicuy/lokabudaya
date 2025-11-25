/**
 * Place types untuk client components
 * Duplikasi dari Prisma schema agar bisa digunakan di client-side
 */

export type Category = "Bangunan" | "Situs" | "Struktur" | "Kawasan";

export const CategoryValues = {
	Bangunan: "Bangunan" as Category,
	Situs: "Situs" as Category,
	Struktur: "Struktur" as Category,
	Kawasan: "Kawasan" as Category,
};

export type Place = {
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
