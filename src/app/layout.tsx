import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Hash",
  description:
    "Explore the best prompts from top creators. Generate images, text & code with ease.",
  icons: "/images/logo.png",
  openGraph: {
    title: "Prompt Hash",
    description:
      "Explore a curated collection of top creator prompts for images, text & code generation.",
    url: "https://prompthash.example.com",
    siteName: "Prompt Hash",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@prompthash",
    creator: "@prompthash",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
