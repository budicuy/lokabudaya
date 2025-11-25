export interface Review {
	id: number;
	userId: number; // Changed to number to match Prisma
	userName?: string; // Add userName
	user?: string; // Optional fallback
	avatar: string;
	date: string | Date; // Allow Date object
	visitCount: number;
	content: string;
	rating: number;
	images: any; // Json type in Prisma, usually string[]
}

export interface Event {
	id?: number;
	title: string;
	date: string | Date;
	description: string;
}

export interface Place {
	id: number;
	name: string;
	category: string;
	location: string;
	description: string;
	visitors: number;
	image: string;
	events: Event[];
	relatedPlaces: any[]; // Can be IDs or Place objects
	reviews: Review[];
	longitude: number;
	latitude: number;
}
