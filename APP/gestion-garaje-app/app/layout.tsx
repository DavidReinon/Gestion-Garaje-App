import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Gestion Garaje",
    description: "Gestion Garaje",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="text-foreground">{children}</body>
        </html>
    );
}
