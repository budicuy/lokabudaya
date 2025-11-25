"use client";

import {useState} from "react";
import {DashboardSidebar} from "@/components/dashboard/DashboardSidebar";
import {PlacesContent} from "@/components/dashboard/PlacesContent";
import {PlaceFormModal} from "@/components/dashboard/PlaceFormModal";
import {ImportPlacesModal} from "@/components/dashboard/ImportPlacesModal";
import {Plus, Upload} from "lucide-react";
import type {Place} from "@/types/place";

type ManagePlacesClientProps = {initialPlaces: Place[]};

export function ManagePlacesClient({initialPlaces}: ManagePlacesClientProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [editingPlace, setEditingPlace] = useState<Place | undefined>(undefined);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleOpenForm = (place?: Place) => {
		setEditingPlace(place);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingPlace(undefined);
	};

	const handleSuccess = () => {
		setRefreshKey((prev) => prev + 1);
		handleCloseForm();
	};

	return (
		<>
			<div className="flex h-screen bg-gray-50">
				<DashboardSidebar />
				<main className="flex-1 overflow-y-auto">
					<div className="p-8">
						{/* Header */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-800">Kelola Tempat Budaya</h1>
								<p className="text-gray-500 mt-1">Manage your cultural places and heritage sites</p>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setIsImportModalOpen(true)}
									className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2">
									<Upload className="w-5 h-5" />
									Import CSV
								</button>
								<button
									type="button"
									onClick={() => handleOpenForm()}
									className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium shadow-lg shadow-yellow-500/30 transition-colors flex items-center gap-2">
									<Plus className="w-5 h-5" />
									Add New Place
								</button>
							</div>
						</div>

						{/* Content */}
						<PlacesContent key={refreshKey} initialPlaces={initialPlaces} onOpenForm={handleOpenForm} />
					</div>
				</main>
			</div>

			{/* Modals */}
			<PlaceFormModal isOpen={isFormOpen} onClose={handleCloseForm} place={editingPlace} onSuccess={handleSuccess} />
			<ImportPlacesModal
				isOpen={isImportModalOpen}
				onClose={() => setIsImportModalOpen(false)}
				onSuccess={() => setRefreshKey((prev) => prev + 1)}
			/>
		</>
	);
}
