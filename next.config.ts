import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{hostname: "api.dicebear.com", protocol: "https"},
			{hostname: "images.unsplash.com*", protocol: "https"},
		],
	},
};

export default nextConfig;
