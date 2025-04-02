"use client";

import {
    SquareUserRound,
    File,
    Home,
    Inbox,
    Settings,
    Car,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importamos el hook usePathname

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Clientes",
        url: "/clientes",
        icon: SquareUserRound,
    },
    {
        title: "Coches",
        url: "/coches",
        icon: Car,
    },
    {
        title: "Recibos",
        url: "/recibos",
        icon: File,
    },
    {
        title: "Ajustes",
        url: "/ajustes",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname(); // Obtenemos la ruta actual

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Secciones</SidebarGroupLabel>
                    <SidebarSeparator className="mb-1" />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    className="mb-1"
                                    key={item.title}
                                >
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url} // Comparamos la ruta actual con el URL del item
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
