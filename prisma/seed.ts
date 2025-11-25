import {prisma} from "../lib/prisma";
import {Category} from "@/prisma/generated/client";
import {STATIC_PLACES} from "../data/places";

// Helper to parse "250 orang pernah ke sini" -> 250
function parseVisitors(visitorString: string): number {
	if (typeof visitorString === "number") return visitorString;
	const match = visitorString.match(/(\d+)/);
	return match ? parseInt(match[0].replace(/\./g, "")) : 0;
}

// Helper to parse Indonesian date "16 September 2025" -> Date object
function parseIndonesianDate(dateString: string): Date {
	const months: {[key: string]: number} = {
		Januari: 0,
		Februari: 1,
		Maret: 2,
		April: 3,
		Mei: 4,
		Juni: 5,
		Juli: 6,
		Agustus: 7,
		September: 8,
		Oktober: 9,
		November: 10,
		Desember: 11,
	};

	const parts = dateString.split(" ");
	if (parts.length !== 3) return new Date();

	const day = parseInt(parts[0]);
	const month = months[parts[1]];
	const year = parseInt(parts[2]);

	return new Date(year, month, day);
}

async function main() {
	console.log("Start seeding...");

	// First, create all places without relations to ensure IDs exist
	for (const place of STATIC_PLACES) {
		const visitors = parseVisitors(place.visitors);

		// Map string category to Enum
		let category: Category = Category.Bangunan;
		if (place.category === "Situs") category = Category.Situs;
		if (place.category === "Struktur") category = Category.Struktur;
		if (place.category === "Kawasan") category = Category.Kawasan;

		console.log(`Upserting place: ${place.name}`);

		await prisma.place.upsert({
			where: {id: place.id},
			update: {
				name: place.name,
				category: category,
				location: place.location,
				description: place.description,
				visitors: visitors,
				image: place.image,
				longitude: place.coordinates[0],
				latitude: place.coordinates[1],
			},
			create: {
				id: place.id,
				name: place.name,
				category: category,
				location: place.location,
				description: place.description,
				visitors: visitors,
				image: place.image,
				longitude: place.coordinates[0],
				latitude: place.coordinates[1],
			},
		});
	}

	// Now update relations (events, reviews, relatedPlaces)
	for (const place of STATIC_PLACES) {
		console.log(`Updating relations for: ${place.name}`);

		// Clear existing relations to avoid duplicates on re-seed
		await prisma.event.deleteMany({where: {placeId: place.id}});
		await prisma.review.deleteMany({where: {placeId: place.id}});

		// Events
		if (place.events) {
			for (const event of place.events) {
				await prisma.event.create({
					data: {
						title: event.title,
						date: parseIndonesianDate(event.date),
						description: event.description,
						placeId: place.id,
					},
				});
			}
		}

		// Reviews
		if (place.reviews) {
			for (const review of place.reviews) {
				await prisma.review.create({
					data: {
						userId: review.user, // Mapping user name to userId for now
						avatar: review.avatar,
						date: parseIndonesianDate(review.date),
						visitCount: review.visitCount,
						content: review.content,
						rating: review.rating,
						images: review.images || [],
						placeId: place.id,
					},
				});
			}
		}

		// Related Places
		if (place.relatedPlaces) {
			// Disconnect all first to avoid duplicates or stale relations
			await prisma.place.update({where: {id: place.id}, data: {relatedPlaces: {set: []}}});

			for (const relatedId of place.relatedPlaces) {
				try {
					await prisma.place.update({where: {id: place.id}, data: {relatedPlaces: {connect: {id: relatedId}}}});
				} catch (e) {
					console.warn(`Could not connect related place ${relatedId} to ${place.id}. It might not exist yet.`);
				}
			}
		}
	}

	console.log("Seeding finished.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
