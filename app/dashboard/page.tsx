import {prisma} from "@/lib/prisma";
import {OverviewCharts} from "@/components/dashboard/OverviewCharts";
import {StatsCards} from "@/components/dashboard/StatsCards";
import {DashboardSidebar} from "@/components/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const places = await prisma.place.findMany({include: {reviews: true}});

	// Calculate stats
	const totalPlaces = places.length;
	const totalVisitors = places.reduce((acc: number, place: any) => acc + place.visitors, 0);
	const totalReviews = places.reduce((acc: number, place: any) => acc + place.reviews.length, 0);

	// Avg rating calculation
	let totalRating = 0;
	let ratingCount = 0;
	places.forEach((place: any) => {
		place.reviews.forEach((review: any) => {
			totalRating += review.rating;
			ratingCount++;
		});
	});
	const avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;

	// Chart Data Preparation
	const categoryMap = new Map<string, {visitors: number; count: number}>();

	places.forEach((place: any) => {
		const current = categoryMap.get(place.category) || {visitors: 0, count: 0};
		categoryMap.set(place.category, {visitors: current.visitors + place.visitors, count: current.count + 1});
	});

	const visitorsByCategory = Array.from(categoryMap.entries()).map(([name, data]) => ({name, value: data.visitors}));

	const placesByCategory = Array.from(categoryMap.entries()).map(([name, data]) => ({name, value: data.count}));

	const topPlaces = [...places]
		.sort((a: any, b: any) => b.visitors - a.visitors)
		.slice(0, 5)
		.map((place: any) => ({
			name: place.name,
			visitors: place.visitors,
			rating:
				place.reviews.length > 0
					? place.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / place.reviews.length
					: 0,
		}));

	return (
		<div className="flex h-screen bg-gray-50">
			<DashboardSidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="p-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-800">Dashboard Budaya</h1>
							<p className="text-gray-500 mt-1">Overview of cultural places and visitor statistics</p>
						</div>
						<div className="flex gap-3">
							<button
								type="button"
								className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">
								Export Report
							</button>
							<button
								type="button"
								className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium shadow-lg shadow-yellow-500/30 transition-colors">
								Add New Place
							</button>
						</div>
					</div>

					<StatsCards stats={{totalPlaces, totalVisitors, totalReviews, avgRating}} />
					<OverviewCharts data={{visitorsByCategory, placesByCategory, topPlaces}} />
				</div>
			</main>
		</div>
	);
}
