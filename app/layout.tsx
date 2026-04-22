import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "ビューン — あの席、実際どう見える？",
    template: "%s | ビューン",
  },
  description: "格闘技会場の座席からの眺めを、チケットを買う前に確認できるアプリ",
  openGraph: {
    siteName: "ビューン",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    site: "@seatview_jp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
        />
        <script
          id="pannellum-script"
          src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
