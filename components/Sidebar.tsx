import {LayoutDashboard, Map as MapIcon, MessageCircle, Moon, Route, Settings, Trash2} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {SignedIn, UserButton} from "@clerk/nextjs";

interface SidebarProps {
	searchOpen: boolean;
	setSearchOpen: (open: boolean) => void;
	jejakBudayaOpen: boolean;
	setJejakBudayaOpen: (open: boolean) => void;
}

export const Sidebar = ({searchOpen, setSearchOpen, jejakBudayaOpen, setJejakBudayaOpen}: SidebarProps) => {
	return (
		<aside className="w-16 border-r-2 border-slate-300 bg-white flex flex-col z-10">
			<div className="flex flex-col items-center py-4 gap-4 flex-1">
				<button
					onClick={() => setSearchOpen(!searchOpen)}
					className={`w-10 h-10 ${searchOpen ? "bg-yellow-500 text-white" : "hover:bg-gray-100 text-gray-600"} rounded-lg flex items-center justify-center`}
					type="button">
					<MapIcon className="w-5 h-5" />
				</button>
				<button
					onClick={() => setJejakBudayaOpen(!jejakBudayaOpen)}
					className={`w-10 h-10 ${jejakBudayaOpen ? "bg-yellow-500 text-white" : "hover:bg-gray-100 text-gray-600"} rounded-lg flex items-center justify-center`}
					type="button">
					<Route className="w-5 h-5" />
				</button>
				<button
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					type="button">
					<MessageCircle className="w-5 h-5" />
				</button>
				<button
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					type="button">
					<Trash2 className="w-5 h-5" />
				</button>
				<Link
					href="/dashboard"
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					title="Dashboard">
					<LayoutDashboard className="w-5 h-5" />
				</Link>
			</div>
			<div className="flex flex-col items-center py-4 gap-4">
				<button
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					type="button">
					<Settings className="w-5 h-5" />
				</button>
				<button
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					type="button">
					<Moon className="w-5 h-5" />
				</button>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</aside>
	);
};
