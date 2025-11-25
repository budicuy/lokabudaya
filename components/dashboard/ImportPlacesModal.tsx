import {Download, Upload, X, FileSpreadsheet} from "lucide-react";
import {useRef, useState} from "react";
import {importPlacesFromCsv} from "@/app/actions/place";

interface ImportPlacesModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export const ImportPlacesModal = ({isOpen, onClose, onSuccess}: ImportPlacesModalProps) => {
	const [isImporting, setIsImporting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	if (!isOpen) return null;

	const handleDownloadTemplate = () => {
		const headers = "name,category,location,description,visitors,image,latitude,longitude";
		const sample =
			'Monas,Bangunan,"Jakarta Pusat","Monumen Nasional",1000,https://example.com/image.jpg,-6.1754,106.8272';
		const csvContent = `data:text/csv;charset=utf-8,${headers}\n${sample}`;
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "places_import_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith(".csv")) {
			alert("Mohon upload file CSV");
			return;
		}

		setIsImporting(true);
		try {
			const text = await file.text();
			const result = await importPlacesFromCsv(text);
			if (result.success) {
				alert(result.message);
				onSuccess();
				onClose();
			} else {
				alert(result.error || "Gagal import CSV");
			}
		} catch (error) {
			console.error("Error reading file:", error);
			alert("Gagal membaca file");
		} finally {
			setIsImporting(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
					<h2 className="text-xl font-bold text-gray-800">Import Places</h2>
					<button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* Template Section */}
					<div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
						<div className="flex items-start gap-3">
							<div className="p-2 bg-blue-100 rounded-lg shrink-0">
								<FileSpreadsheet className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<h3 className="font-semibold text-blue-900 text-sm mb-1">Download Template</h3>
								<p className="text-xs text-blue-700 mb-3">
									Gunakan template ini untuk memastikan format data Anda benar sebelum melakukan import.
								</p>
								<button
									type="button"
									onClick={handleDownloadTemplate}
									className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
									<Download className="w-3.5 h-3.5" />
									Download CSV Template
								</button>
							</div>
						</div>
					</div>

					{/* Upload Section */}
					<div className="space-y-3">
						<label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700">
							Upload CSV File
						</label>
						<button
							type="button"
							onClick={() => !isImporting && fileInputRef.current?.click()}
							className={`w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-500 hover:bg-yellow-50 transition-all cursor-pointer group ${
								isImporting ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							<input
								id="csv-upload"
								type="file"
								accept=".csv"
								className="hidden"
								ref={fileInputRef}
								onChange={handleFileChange}
								disabled={isImporting}
							/>
							<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-100 transition-colors">
								<Upload className="w-6 h-6 text-gray-400 group-hover:text-yellow-600" />
							</div>
							<p className="text-sm font-medium text-gray-700 mb-1">
								{isImporting ? "Mengimport data..." : "Klik untuk upload file CSV"}
							</p>
							<p className="text-xs text-gray-500">Mendukung format .csv</p>
						</button>
					</div>
				</div>

				{/* Footer */}
				<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						disabled={isImporting}
						className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm">
						Batal
					</button>
				</div>
			</div>
		</div>
	);
};
