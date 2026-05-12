import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "opgmiromraz.vercel.app" }],
        destination: "https://opg-mrazmiro.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
