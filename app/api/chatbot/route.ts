import {GoogleGenerativeAI} from "@google/generative-ai";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `Kamu adalah Pandu, asisten pemandu digital budaya Indonesia yang ramah dan berpengetahuan luas tentang tempat-tempat bersejarah dan budaya di Indonesia.

Tugasmu:
1. Merekomendasikan tempat wisata budaya dan sejarah berdasarkan lokasi atau preferensi pengguna
2. Memberikan informasi sejarah dan cerita unik tentang tempat-tempat budaya
3. Menyarankan rute perjalanan wisata budaya
4. Menjawab pertanyaan tentang budaya dan sejarah Indonesia

Gaya bicara:
- Gunakan bahasa Indonesia yang santai tapi sopan
- Tambahkan emoji yang relevan untuk membuat percakapan lebih hidup
- Berikan respons yang singkat, padat, dan informatif (maksimal 2-3 kalimat)
- JANGAN gunakan format markdown seperti **bold** atau *italic*
- JANGAN sebutkan ID tempat dalam pesan, cukup sebutkan nama tempatnya saja
- Jika merekomendasikan tempat, cukup berikan pengantar singkat, detail tempat akan ditampilkan dalam card terpisah

PENTING: Kamu HARUS SELALU mengembalikan respons dalam format JSON yang valid seperti ini:
{
  "message": "Pesan responmu di sini tanpa markdown dan tanpa ID",
  "recommendedPlaces": [1, 2, 3]
}

Aturan format JSON:
- "message" berisi teks respons singkat untuk pengguna (tanpa markdown, tanpa ID)
- "recommendedPlaces" berisi array ID tempat yang kamu rekomendasikan (maksimal 5 tempat)
- Jika tidak ada rekomendasi tempat, gunakan array kosong []
- SELALU kembalikan JSON valid, jangan pernah kembalikan teks biasa

Kamu akan diberikan daftar tempat yang tersedia dalam database. Gunakan hanya ID tempat dari daftar tersebut untuk recommendedPlaces.`;

export async function POST(request: Request) {
	try {
		const {message, history} = await request.json();

		// Fetch all places from database to provide context
		const places = await prisma.place.findMany({
			select: {id: true, name: true, category: true, location: true, description: true, visitors: true},
		});

		const placesContext = `
Daftar tempat yang tersedia dalam database:
${places.map((p) => `- ID: ${p.id}, Nama: ${p.name}, Kategori: ${p.category}, Lokasi: ${p.location}, Deskripsi: ${p.description.substring(0, 100)}..., Pengunjung: ${p.visitors}`).join("\n")}
`;

		const model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash",
			generationConfig: {temperature: 0.7, topP: 0.95, topK: 40, maxOutputTokens: 1024},
		});

		// Build chat history
		const chatHistory =
			history?.map((msg: {role: string; content: string}) => ({
				role: msg.role === "user" ? "user" : "model",
				parts: [{text: msg.content}],
			})) || [];

		const chat = model.startChat({
			history: [
				{role: "user", parts: [{text: systemPrompt + "\n\n" + placesContext}]},
				{
					role: "model",
					parts: [
						{
							text:
								'{"message": "Halo! Saya Pandu, pemandu digital budaya. Saya siap membantu kamu menjelajahi tempat-tempat bersejarah dan budaya di Indonesia! 👋🏛️", "recommendedPlaces": []}',
						},
					],
				},
				...chatHistory,
			],
		});

		const result = await chat.sendMessage(message);
		const response = result.response;
		const text = response.text();

		// Try to parse as JSON
		let parsedResponse: {message: string; recommendedPlaces: number[]};
		try {
			// Remove markdown code blocks if present
			let cleanText = text
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "")
				.trim();

			// Try to find JSON object in the text (in case AI returns text + JSON)
			const jsonMatch = cleanText.match(/\{[\s\S]*"message"[\s\S]*"recommendedPlaces"[\s\S]*\}/);
			if (jsonMatch) {
				cleanText = jsonMatch[0];
			}

			parsedResponse = JSON.parse(cleanText);

			// Clean up the message: remove markdown formatting and IDs
			parsedResponse.message = parsedResponse.message
				.replace(/\*\*/g, "") // Remove bold markdown
				.replace(/\*/g, "") // Remove italic markdown
				.replace(/\(ID:\s*\d+\)/g, "") // Remove (ID: xxx) patterns
				.replace(/ID:\s*\d+/g, "") // Remove ID: xxx patterns
				.replace(/```json[\s\S]*```/g, "") // Remove any JSON code blocks in message
				.replace(/\{[\s\S]*"recommendedPlaces"[\s\S]*\}/g, "") // Remove JSON objects in message
				.replace(/\s+/g, " ") // Normalize whitespace
				.trim();
		} catch {
			// If not valid JSON, extract message from text and clean it
			const cleanMessage = text
				.replace(/```json[\s\S]*```/g, "") // Remove JSON code blocks
				.replace(/\{[\s\S]*"message"[\s\S]*"recommendedPlaces"[\s\S]*\}/g, "") // Remove JSON objects
				.replace(/\*\*/g, "")
				.replace(/\*/g, "")
				.replace(/\(ID:\s*\d+\)/g, "")
				.replace(/ID:\s*\d+/g, "")
				.replace(/\s+/g, " ")
				.trim();

			// Try to extract recommendedPlaces from the original text
			let recommendedPlaces: number[] = [];
			const placesMatch = text.match(/"recommendedPlaces"\s*:\s*\[([\d,\s]*)\]/);
			if (placesMatch) {
				const placesStr = placesMatch[1];
				recommendedPlaces = placesStr
					.split(",")
					.map((s) => parseInt(s.trim()))
					.filter((n) => !Number.isNaN(n));
			}

			parsedResponse = {message: cleanMessage || "Berikut rekomendasi tempat untukmu! 🏛️", recommendedPlaces};
		}

		// Fetch recommended places details
		let recommendedPlacesData: Awaited<ReturnType<typeof prisma.place.findMany>> = [];
		if (parsedResponse.recommendedPlaces && parsedResponse.recommendedPlaces.length > 0) {
			recommendedPlacesData = await prisma.place.findMany({where: {id: {in: parsedResponse.recommendedPlaces}}});
		}

		return NextResponse.json({success: true, message: parsedResponse.message, places: recommendedPlacesData});
	} catch (error) {
		console.error("Chatbot error:", error);
		return NextResponse.json({success: false, error: "Maaf, terjadi kesalahan. Silakan coba lagi."}, {status: 500});
	}
}
