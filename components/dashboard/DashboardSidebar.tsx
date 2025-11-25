"use client";

import {FileText, Home, LayoutDashboard, Settings, Users} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export const DashboardSidebar = () => {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === "/dashboard" && pathname === "/dashboard") return true;
		if (path !== "/dashboard" && pathname?.startsWith(path)) return true;
		return false;
	};

	const getLinkClass = (path: string) => {
		const active = isActive(path);
		return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
			active ? "bg-yellow-50 text-yellow-600" : "text-gray-600 hover:bg-gray-50"
		}`;
	};

	return (
		<aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
			<div className="p-6 flex items-center gap-3 border-b border-gray-100">
				<div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">LB</div>
				<span className="font-bold text-xl text-gray-800">Loka Budaya</span>
			</div>

			<nav className="flex-1 p-4 space-y-2">
				<Link href="/dashboard" className={getLinkClass("/dashboard")}>
					<LayoutDashboard className="w-5 h-5" />
					<span>Overview</span>
				</Link>

				<Link
					href="/"
					className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
					<Home className="w-5 h-5" />
					<span>Back to Map</span>
				</Link>

				<div className="pt-4 pb-2">
					<p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Manage</p>
				</div>

				<Link href="/dashboard/places" className={`w-full text-left ${getLinkClass("/dashboard/places")}`}>
					<FileText className="w-5 h-5" />
					<span>Places</span>
				</Link>

				<button
					type="button"
					className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors text-left">
					<Users className="w-5 h-5" />
					<span>Reviews</span>
				</button>

				<button
					type="button"
					className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors text-left">
					<Settings className="w-5 h-5" />
					<span>Settings</span>
				</button>
			</nav>

			<div className="p-4 border-t border-gray-100">
				<div className="flex items-center gap-3 px-4 py-3">
					<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
						{/* Placeholder for avatar */}
						<div className="w-full h-full bg-linear-to-br from-yellow-400 to-orange-500" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-700">Admin User</p>
						<p className="text-xs text-gray-500">admin@lokabudaya.com</p>
					</div>
				</div>
			</div>
		</aside>
	);
};
