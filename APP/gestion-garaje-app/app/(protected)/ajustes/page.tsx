"use client";

import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalContext } from "@/context/global-context";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Ajustes() {
    const { user, username } = useGlobalContext();

    const handleLogout = async () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que quieres cerrar sesión?"
        );
        if (!confirmed) return;
        await signOutAction();
        redirect("/sign-in");
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
                <Separator className="my-4" />
                <p className="text-muted-foreground">
                    Aquí puedes gestionar tu cuenta o encontrar información de
                    soporte.
                </p>
            </div>

            <div className="flex flex-col items-center align-middle">
                <Card className="hover:shadow-md transition-shadow max-w-md w-full">
                    <CardContent className="space-y-2 mt-4">
                        <div className="py-2">
                            <p className="font-medium">Versión App</p>
                            <p className="text-sm text-gray-500">1.0.0</p>
                        </div>
                        <Separator className="my-1" />
                        <div className="py-2">
                            <p className="font-medium">Soporte</p>
                            <p className="text-sm text-gray-500">
                                Contacta con el administrador
                            </p>
                        </div>
                        <Separator className="my-4" />
                        <div className="py-2">
                            <p className="font-medium">Cuenta</p>
                            <ul className="text-sm text-gray-500 space-y-1">
                                <li>
                                    <span className="font-medium text-gray-700">
                                        Usuario:
                                    </span>{" "}
                                    {username || "No disponible"}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">
                                        Email:
                                    </span>{" "}
                                    {user?.email || "No disponible"}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">
                                        ID:
                                    </span>{" "}
                                    {user?.id || "No disponible"}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">
                                        Fecha de Creación:
                                    </span>{" "}
                                    {user?.created_at
                                        ? new Date(
                                              user?.created_at
                                          ).toLocaleDateString("es-ES", {
                                              year: "numeric",
                                              month: "numeric",
                                              day: "numeric",
                                          })
                                        : "No disponible"}
                                </li>
                            </ul>
                            <div className="mt-8 flex justify-center">
                                <Button
                                    onClick={handleLogout}
                                    className="flex items-center px-6 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar sesión
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer minimalista */}
            <div className="mt-11 w-full">
                <p className="text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()} David Reinón García - Todos
                    los derechos reservados
                </p>
            </div>
        </div>
    );
}
