import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Gestion Garaje",
    description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex-1 w-full flex flex-col gap-20 items-center">
                            <nav className="w-full flex justify-evenly items-center  border-b border-b-foreground/10 h-16">
                              <Link href={"/"}>Next.js Supabase Starter</Link>
                              <Link href={"/"}>Ruta 2</Link>
                              <Link href={"/"}>Ruta 3</Link>
                            </nav>
                            <div className="flex flex-col gap-20 max-w-5xl p-5">
                                {children}
                            </div>

                            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                                <p>
                                  David Reinon Garcia ©2025
                                </p>
                                <ThemeSwitcher />
                            </footer>
                        </div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
