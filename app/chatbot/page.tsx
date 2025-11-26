"use client";

import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Send, ArrowRight, Users} from "lucide-react";
import {Sidebar} from "@/components/Sidebar";
import {Navbar} from "@/components/Navbar";
import type {Place} from "@/types/place";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	places?: Place[];
}

export default function ChatbotPage() {
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [jejakBudayaOpen, setJejakBudayaOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleNavigateToPlace = (place: Place) => {
		// Navigate to home page with place coordinates as query params
		router.push(`/?placeId=${place.id}&lat=${place.latitude}&lng=${place.longitude}`);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {id: Date.now().toString(), role: "user", content: input.trim()};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chatbot", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({message: input.trim(), history: messages.map((m) => ({role: m.role, content: m.content}))}),
			});

			const data = await response.json();

			if (data.success) {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: data.message,
					places: data.places,
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				const errorMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: data.error || "Maaf, terjadi kesalahan. Silakan coba lagi.",
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch {
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi.",
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const PlaceCard = ({place}: {place: Place}) => (
		<div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
			<div className="w-28 h-28 shrink-0 relative">
				<Image src={place.image || "/placeholder.jpg"} alt={place.name} fill className="object-cover" />
			</div>
			<div className="flex-1 p-3 flex flex-col justify-between">
				<div>
					<div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
						<span>🏛️</span>
						<span>{place.category}</span>
					</div>
					<h3 className="font-semibold text-gray-800 text-sm">{place.name}</h3>
					<p className="text-xs text-gray-500">{place.location}</p>
					<p className="text-xs text-gray-600 mt-1 line-clamp-2">{place.description.substring(0, 80)}...</p>
				</div>
				<div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
					<Users className="w-3 h-3" />
					<span>{place.visitors.toLocaleString()} orang pernah ke sini</span>
				</div>
			</div>
			<div className="flex items-center pr-3">
				<button
					type="button"
					onClick={() => handleNavigateToPlace(place)}
					title="Lihat di peta"
					className="w-8 h-8 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center text-white transition-colors">
					<ArrowRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50">
			<Navbar />
			<div className="flex-1 flex relative overflow-hidden">
				<Sidebar
					searchOpen={searchOpen}
					setSearchOpen={setSearchOpen}
					jejakBudayaOpen={jejakBudayaOpen}
					setJejakBudayaOpen={setJejakBudayaOpen}
				/>

				<div className="flex-1 flex flex-col">
					{/* Header */}
					<div className="bg-white border-b border-gray-200 px-6 py-4">
						<h1 className="text-xl font-semibold text-gray-800">Chatbot AI</h1>
					</div>

					{/* Chat Area */}
					<div className="flex-1 overflow-y-auto px-6 py-6">
						{messages.length === 0 ? (
							/* Welcome Screen */
							<div className="flex flex-col items-center justify-center h-full text-center">
								<div className="relative w-64 h-52 mb-6">
									<Image
										src="/chatbot-illustration.svg"
										alt="Chatbot"
										fill
										className="object-contain"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.style.display = "none";
										}}
									/>
									{/* Fallback illustration */}
									<div className="w-full h-full flex items-center justify-center">
										<div className="text-8xl">🤖</div>
									</div>
								</div>
								<h2 className="text-2xl font-bold text-amber-600 mb-3">Pemandu Digital Budaya</h2>
								<p className="text-gray-600 max-w-md">
									Halo saya Pandu! 👋 Saya siap menemani penjelajahan budayamu. Kamu butuh rekomendasi tempat, rute perjalanan,
									atau cerita sejarah unik hari ini?
								</p>
							</div>
						) : (
							/* Messages */
							<div className="max-w-3xl mx-auto space-y-6">
								{messages.map((message) => (
									<div key={message.id}>
										{message.role === "user" ? (
											<div className="flex justify-end">
												<div className="bg-amber-700 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%]">
													{message.content}
												</div>
											</div>
										) : (
											<div className="space-y-4">
												<div className="text-gray-700 leading-relaxed">{message.content}</div>
												{message.places && message.places.length > 0 && (
													<div className="space-y-3">
														{message.places.map((place) => (
															<PlaceCard key={place.id} place={place} />
														))}
													</div>
												)}
											</div>
										)}
									</div>
								))}
								{isLoading && (
									<div className="flex items-center gap-2 text-gray-500">
										<div className="flex gap-1">
											<span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: "0ms"}} />
											<span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: "150ms"}} />
											<span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: "300ms"}} />
										</div>
										<span className="text-sm">Pandu sedang mengetik...</span>
									</div>
								)}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>

					{/* Input Area */}
					<div className="bg-gray-50 px-6 py-4">
						<form onSubmit={handleSubmit} className="w-full">
							<div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-sm border border-gray-200">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Tanya tentang sejarah, lokasi, atau rute..."
									className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
									disabled={isLoading}
								/>
								<button
									type="submit"
									disabled={!input.trim() || isLoading}
									className="w-10 h-10 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors shrink-0">
									<Send className="w-5 h-5" />
								</button>
							</div>
						</form>
						<p className="text-center text-xs text-gray-400 mt-3">Pandu can make mistakes. Please check again.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
