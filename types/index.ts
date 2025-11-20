export interface Review {
	id: number;
	user: string;
	avatar: string;
	date: string;
	visitCount: number;
	content: string;
	rating: number;
	images: string[];
}

export interface Place {
	id: number;
	name: string;
	category: string;
	location: string;
	description: string;
	visitors: string;
	image: string;
	events: {title: string; date: string; description: string}[];
	relatedPlaces: number[];
	reviews: Review[];
	coordinates: [number, number];
}
