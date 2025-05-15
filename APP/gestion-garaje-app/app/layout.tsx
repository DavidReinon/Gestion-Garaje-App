import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { GlobalContextProvider } from "@/context/global-context";
import { headers } from "next/headers";

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
    // const supabase = await createClient();
    // const pathname = headers().get("x-current-path") || ""; // fallback si no existe

    // // Verifica si hay sesión (protección), excepto en rutas públicas
    // const publicRoutes = ["/sign-in", "/sign-up", "/auth/callback"];
    // if (!publicRoutes.includes(pathname)) {
    //     const {
    //         data: { session },
    //     } = await supabase.auth.getSession();

    //     if (!session) {
    //         redirect("/sign-in");
    //     }
    // }

    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    return (
        <html
            lang="en"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body className="text-foreground">
                <GlobalContextProvider user={null}>
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
                </GlobalContextProvider>
            </body>
        </html>
    );
}
