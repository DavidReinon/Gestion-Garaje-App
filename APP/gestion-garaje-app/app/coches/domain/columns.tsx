"use client";

import { Tables } from "@/utils/types/supabase";
import { ColumnDef } from "@tanstack/react-table";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ActionButtons from "@/components/action-buttons";

export type Coche = Tables<"coches">;

export const getColumns = (
    supabase: SupabaseClient,
    router: AppRouterInstance
): ColumnDef<Coche>[] => [
    {
        accessorKey: "marca",
        header: "Marca",
    },
    {
        accessorKey: "modelo",
        header: "Modelo",
    },
    {
        accessorKey: "matricula",
        header: "Matrícula",
    },
    {
        accessorKey: "color",
        header: "Color",
    },
    {
        accessorKey: "numero_plaza",
        header: "Nº Plaza",
    },
    {
        accessorKey: "año",
        header: "Año",
    },
    {
        accessorKey: "dueño",
        header: "Dueño",
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const coche = row.original;

            const handleEdit = () => router.push(`/coches/editar/${coche.id}`);
            const handleDelete = async () => {
                if (
                    confirm("¿Estás seguro de que deseas eliminar este coche?")
                ) {
                    const { error } = await supabase
                        .from("coches")
                        .delete()
                        .eq("id", coche.id);
                    if (error) {
                        console.error("Error al eliminar el coche:", error);
                        alert("Hubo un error al eliminar el coche.");
                        return;
                    }
                    alert("Coche eliminado correctamente.");
                    location.reload();
                }
            };

            return (
                <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
            );
        },
    },
];
