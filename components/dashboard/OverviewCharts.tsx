"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const COLORS = ["#3B82F6", "#EAB308", "#A855F7", "#F97316", "#10B981"];

interface ChartData {
	visitorsByCategory: {name: string; value: number}[];
	placesByCategory: {name: string; value: number}[];
	topPlaces: {name: string; visitors: number; rating: number}[];
}

export const OverviewCharts = ({data}: {data: ChartData}) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{/* Visitors by Category */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<h3 className="text-lg font-bold text-gray-800 mb-6">Visitors by Category</h3>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data.visitorsByCategory}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
							<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#6B7280"}} dy={10} />
							<YAxis axisLine={false} tickLine={false} tick={{fill: "#6B7280"}} />
							<Tooltip
								cursor={{fill: "#F3F4F6"}}
								contentStyle={{borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}
							/>
							<Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={40} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Places Distribution */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
				<h3 className="text-lg font-bold text-gray-800 mb-6">Places Distribution</h3>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data.placesByCategory}
								cx="50%"
								cy="50%"
								innerRadius={80}
								outerRadius={110}
								paddingAngle={5}
								dataKey="value">
								{data.placesByCategory.map((entry, index) => (
									<Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
							<Legend verticalAlign="bottom" height={36} iconType="circle" />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Top Places */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
				<h3 className="text-lg font-bold text-gray-800 mb-6">Top Popular Places</h3>
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data.topPlaces} layout="vertical" margin={{left: 20}}>
							<CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
							<XAxis type="number" axisLine={false} tickLine={false} tick={{fill: "#6B7280"}} />
							<YAxis
								dataKey="name"
								type="category"
								width={150}
								axisLine={false}
								tickLine={false}
								tick={{fill: "#6B7280", fontSize: 14}}
							/>
							<Tooltip
								cursor={{fill: "#F3F4F6"}}
								contentStyle={{borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}
							/>
							<Bar dataKey="visitors" fill="#EAB308" radius={[0, 6, 6, 0]} barSize={30} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};
