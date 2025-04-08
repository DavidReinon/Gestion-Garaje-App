"use client";

import { Tables } from "@/utils/types/supabase";
import { ColumnDef } from "@tanstack/react-table";

export type Coche = Tables<"coches">;

export const columns: ColumnDef<Coche>[] = [
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
        accessorKey: "año",
        header: "Año",
    },
    {
        accessorKey: "dueño",
        header: "Dueño",
    },
    {
        accessorKey: "telefono",
        header: "Teléfono",
    },
];
