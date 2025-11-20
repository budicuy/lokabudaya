import {Layers, Minus, Plus} from "lucide-react";

interface MapControlsProps {
	zoomIn: () => void;
	zoomOut: () => void;
	layerOpen: boolean;
	setLayerOpen: (open: boolean) => void;
}

export const MapControls = ({zoomIn, zoomOut, layerOpen, setLayerOpen}: MapControlsProps) => {
	return (
		<div>
			<div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
				<button
					onClick={zoomIn}
					className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
					type="button">
					<Plus className="w-5 h-5" />
				</button>
				<button
					onClick={zoomOut}
					className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
					type="button">
					<Minus className="w-5 h-5" />
				</button>
				<button
					onClick={() => setLayerOpen(!layerOpen)}
					className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center ${
						layerOpen ? "bg-yellow-500 text-white" : "bg-white hover:bg-gray-50"
					}`}
					type="button">
					<Layers className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};
