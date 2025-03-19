import type { Metadata } from "next";
import "./globals.css";
import { KeplrWalletProvider } from "@/hooks/use-keplr-wallet";

export const metadata: Metadata = {
	title: "Prompt Hub",
	description:
		"Explore the best prompts from top creators. Generate images, text & code with ease.",
	themeColor: "#ffffff",
	icons: "/images/logo.png",
	openGraph: {
		title: "Prompt Hub",
		description:
			"Explore a curated collection of top creator prompts for images, text & code generation.",
		url: "https://prompthub.example.com",
		siteName: "Prompt Hub",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@prompthub",
		creator: "@prompthub",
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
				<KeplrWalletProvider>{children} </KeplrWalletProvider>
			</body>
		</html>
	);
}
