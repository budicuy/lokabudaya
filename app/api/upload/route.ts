import {put} from "@vercel/blob";
import {NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import path from "node:path";

export async function POST(request: Request): Promise<NextResponse> {
	const {searchParams} = new URL(request.url);
	const filename = searchParams.get("filename");

	if (!filename) {
		return NextResponse.json({error: "Filename is required"}, {status: 400});
	}

	// Generate random filename with folder 'places'
	// Format: places/uuid-originalFilename
	const ext = path.extname(filename);
	const name = path.basename(filename, ext);
	const uniqueFilename = `places/${randomUUID()}-${name}${ext}`;

	const blob = await put(uniqueFilename, request.body || "", {access: "public"});

	return NextResponse.json(blob);
}

// The next lines are required for Pages API Routes only
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
