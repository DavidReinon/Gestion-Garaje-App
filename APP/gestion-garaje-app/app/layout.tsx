import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const supabase = await createClient();
    // const {
    //     data: { session },
    // } = await supabase.auth.getSession();

    // if (!session) {
    //     redirect("/sign-in");
    // }

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
                    <SidebarProvider>
                        <AppSidebar />
                        <div className="flex flex-col w-full min-h-screen mt-2">
                            <SidebarTrigger />
                            <main className="w-full">{children}</main>
                        </div>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
