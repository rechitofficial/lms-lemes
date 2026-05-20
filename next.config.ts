import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io`,
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
