import {prisma} from "@/lib/prisma";
import {ManagePlacesClient} from "@/components/dashboard/ManagePlacesClient";

export const dynamic = "force-dynamic";

export default async function ManagePlacesPage() {
	const places = await prisma.place.findMany({include: {events: true, reviews: true}, orderBy: {id: "desc"}});

	// Transform to match Place type
	const transformedPlaces = places.map((place) => ({
		id: place.id,
		name: place.name,
		category: place.category as "Bangunan" | "Situs" | "Struktur" | "Kawasan",
		location: place.location,
		description: place.description,
		visitors: place.visitors,
		image: place.image,
		longitude: place.longitude,
		latitude: place.latitude,
	}));

	return <ManagePlacesClient initialPlaces={transformedPlaces} />;
}
