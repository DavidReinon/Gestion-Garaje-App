"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Car {
    id: number;
    owner: string;
    model: string;
    status: string;
}

// Datos de ejemplo
const data: Car[] = [
    { id: 1, owner: "Juan Pérez", model: "Ford Mustang", status: "Activo" },
    {
        id: 2,
        owner: "María López",
        model: "Toyota Supra",
        status: "En reparación",
    },
    { id: 3, owner: "Carlos Gómez", model: "Tesla Model 3", status: "Activo" },
];

// Definir columnas
const columns: ColumnDef<Car>[] = [
    {
        accessorKey: "owner",
        header: "Propietario",
    },
    {
        accessorKey: "model",
        header: "Modelo",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
            <span
                className={
                    row.original.status === "Activo"
                        ? "text-green-500"
                        : "text-red-500"
                }
            >
                {row.original.status}
            </span>
        ),
    },
];

export function DataTable() {
    const [tableData] = useState(data);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-x-auto">
            <Table className="w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
