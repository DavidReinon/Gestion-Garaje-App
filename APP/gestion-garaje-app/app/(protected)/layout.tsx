import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalContextProvider } from "@/context/global-context";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ProtectesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {
        data: { session },
    } = await (await supabase).auth.getSession();

    if (!session) {
        redirect("/sign-in");
    }

    const {
        data: { user },
    } = await (await supabase).auth.getUser();

    return (
        <GlobalContextProvider user={user}>
            <ThemeProvider
                attribute="class"
                defaultTheme="white"
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
    );
}
