import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{hostname: "api.dicebear.com", protocol: "https"},
			{hostname: "images.unsplash.com*", protocol: "https"},
			{hostname: "odcsltlr8veloug2.public.blob.vercel-storage.com", protocol: "https"},
			{hostname: "img.clerk.com", protocol: "https"},
			{hostname: "example.com", protocol: "https"},
		],
	},
};

export default nextConfig;
