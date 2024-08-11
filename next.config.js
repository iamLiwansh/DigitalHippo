/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "digital-hippo-nine-sepia.vercel.app",
			},
		],
	},
};

module.exports = nextConfig;