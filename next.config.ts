import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "msp.c.yimg.jp" },
      { protocol: "https", hostname: "cdn.onefc.com" },
      { protocol: "https", hostname: "d1uzk9o9cg136f.cloudfront.net" },
      { protocol: "https", hostname: "life-cdn.oricon.co.jp" },
      { protocol: "https", hostname: "boxingnews.jp" },
      { protocol: "https", hostname: "cdn-zaseki.music-mdata.com" },
      { protocol: "https", hostname: "w1.onlineticket.jp" },
    ],
  },
};

export default nextConfig;
