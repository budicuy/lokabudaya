import {MapPin, Users, Star, MessageSquare} from "lucide-react";

interface Stats {
	totalPlaces: number;
	totalVisitors: number;
	totalReviews: number;
	avgRating: number;
}

export const StatsCards = ({stats}: {stats: Stats}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
				<div>
					<p className="text-sm font-medium text-gray-500 mb-1">Total Places</p>
					<h3 className="text-2xl font-bold text-gray-800">{stats.totalPlaces}</h3>
					<p className="text-xs text-green-500 mt-2 font-medium">+12% from last month</p>
				</div>
				<div className="p-3 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
					<MapPin className="w-6 h-6 text-white" />
				</div>
			</div>

			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
				<div>
					<p className="text-sm font-medium text-gray-500 mb-1">Total Visitors</p>
					<h3 className="text-2xl font-bold text-gray-800">{stats.totalVisitors.toLocaleString()}</h3>
					<p className="text-xs text-green-500 mt-2 font-medium">+5% from last month</p>
				</div>
				<div className="p-3 rounded-xl bg-yellow-500 shadow-lg shadow-yellow-500/30">
					<Users className="w-6 h-6 text-white" />
				</div>
			</div>

			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
				<div>
					<p className="text-sm font-medium text-gray-500 mb-1">Total Reviews</p>
					<h3 className="text-2xl font-bold text-gray-800">{stats.totalReviews}</h3>
					<p className="text-xs text-green-500 mt-2 font-medium">+8% from last month</p>
				</div>
				<div className="p-3 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/30">
					<MessageSquare className="w-6 h-6 text-white" />
				</div>
			</div>

			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
				<div>
					<p className="text-sm font-medium text-gray-500 mb-1">Average Rating</p>
					<h3 className="text-2xl font-bold text-gray-800">{stats.avgRating.toFixed(1)}</h3>
					<p className="text-xs text-green-500 mt-2 font-medium">+0.2 from last month</p>
				</div>
				<div className="p-3 rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
					<Star className="w-6 h-6 text-white" />
				</div>
			</div>
		</div>
	);
};
