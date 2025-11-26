"use client";

import {LayoutDashboard, Map as MapIcon, MessageCircle, Moon, Route, Settings, Store} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {SignedIn, UserButton} from "@clerk/nextjs";

interface SidebarProps {
	searchOpen?: boolean;
	setSearchOpen?: (open: boolean) => void;
	jejakBudayaOpen?: boolean;
	setJejakBudayaOpen?: (open: boolean) => void;
}

export const Sidebar = ({searchOpen, setSearchOpen, jejakBudayaOpen, setJejakBudayaOpen}: SidebarProps) => {
	const pathname = usePathname();
	const isHomePage = pathname === "/";
	const isChatbotPage = pathname === "/chatbot";

	const handleMapClick = () => {
		if (isHomePage && setSearchOpen) {
			setSearchOpen(!searchOpen);
		}
		// If not on home page, the Link will handle navigation
	};

	const handleJejakClick = () => {
		if (isHomePage && setJejakBudayaOpen) {
			setJejakBudayaOpen(!jejakBudayaOpen);
		}
		// If not on home page, the Link will handle navigation
	};

	return (
		<aside className="w-16 border-r-2 border-slate-300 bg-white flex flex-col z-10">
			<div className="flex flex-col items-center py-4 gap-4 flex-1">
				{isHomePage ? (
					<button
						onClick={handleMapClick}
						className={`w-10 h-10 ${searchOpen ? "bg-yellow-500 text-white" : "hover:bg-gray-100 text-gray-600"} rounded-lg flex items-center justify-center`}
						type="button"
						title="Peta">
						<MapIcon className="w-5 h-5" />
					</button>
				) : (
					<Link
						href="/"
						className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center"
						title="Peta">
						<MapIcon className="w-5 h-5" />
					</Link>
				)}
				{isHomePage ? (
					<button
						onClick={handleJejakClick}
						className={`w-10 h-10 ${jejakBudayaOpen ? "bg-yellow-500 text-white" : "hover:bg-gray-100 text-gray-600"} rounded-lg flex items-center justify-center`}
						type="button"
						title="Jejak Budaya">
						<Route className="w-5 h-5" />
					</button>
				) : (
					<Link
						href="/"
						className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center"
						title="Jejak Budaya">
						<Route className="w-5 h-5" />
					</Link>
				)}
				<Link
					href="/chatbot"
					className={`w-10 h-10 ${isChatbotPage ? "bg-yellow-500 text-white" : "hover:bg-gray-100 text-gray-600"} rounded-lg flex items-center justify-center`}
					title="Chatbot AI">
					<MessageCircle className="w-5 h-5" />
				</Link>
				<button
					className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"
					type="button">
					<Store className="w-5 h-5" />
				</button>
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
