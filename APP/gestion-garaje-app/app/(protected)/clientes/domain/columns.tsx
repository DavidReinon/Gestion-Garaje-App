"use client";

import { Tables } from "@/utils/types/supabase";
import { ColumnDef } from "@tanstack/react-table";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ActionButtons from "@/components/action-buttons";

export type Cliente = Tables<"clientes">;

export const getColumns = (
    supabase: SupabaseClient,
    router: AppRouterInstance
): ColumnDef<Cliente>[] => [
    {
        accessorKey: "nombre",
        header: "Nombre",
    },
    {
        accessorKey: "apellidos",
        header: "Apellidos",
    },
    {
        accessorKey: "telefono",
        header: "Teléfono",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "fecha_entrada",
        header: "Fecha Entrada",
    },
    { accessorKey: "coche", header: "Coche" },
    { accessorKey: "matricula", header: "Matrícula" },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const cliente = row.original;

            const handleEdit = () =>
                router.push(`/clientes/editar/${cliente.id}`);
            const handleDelete = async () => {
                if (
                    confirm(
                        "¿Estás seguro de que deseas eliminar este cliente?"
                    )
                ) {
                    const { error } = await supabase
                        .from("clientes")
                        .delete()
                        .eq("id", cliente.id);
                    if (error) {
                        console.error("Error al eliminar el cliente:", error);
                        alert("Hubo un error al eliminar el cliente.");
                        return;
                    }
                    alert("Cliente eliminado correctamente.");
                    location.reload();
                }
            };

            return (
                <ActionButtons onEdit={handleEdit} onDelete={handleDelete} />
            );
        },
    },
];
