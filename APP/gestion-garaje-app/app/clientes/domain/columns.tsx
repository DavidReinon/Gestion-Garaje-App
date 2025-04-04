"use client";

import { Tables } from "@/utils/types/supabase";
import { ColumnDef } from "@tanstack/react-table";

export type Cliente = Tables<"clientes">;

export const columns: ColumnDef<Cliente>[] = [
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
    { accessorKey: "coche", header: "Coche" }, // 🚗 Nueva columna
    { accessorKey: "matricula", header: "Matrícula" }, // 🔢 Nueva columna
];
