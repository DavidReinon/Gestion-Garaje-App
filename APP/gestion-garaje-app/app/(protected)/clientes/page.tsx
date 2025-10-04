"use client";

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import LoadingSpin from "@/components/loading-spin";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientesFilter } from "@/features/clientes/types/types";
import { Separator } from "@/components/ui/separator";

type Cliente = Tables<"clientes"> & {
    coche?: string;
    matricula?: string;
};

const ClientesView: FC = () => {
    const [allClients, setAllClients] = useState<Cliente[]>([]);
    const [filteredClients, setFilteredClients] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterOption, setFilterOption] = useState<ClientesFilter>(
        ClientesFilter.Activos
    );

    const supabase = createClient();
    const router = useRouter();

    const columns = getColumns(supabase, router);

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("clientes")
                .select(`*, coches (marca, modelo, matricula)`); // JOIN con "coches"

            if (error) {
                console.error("Error al obtener clientes:", error);
                setLoading(false);
                return;
            }

            console.log(data);
            const clientesFinalData = data.map((cliente) => ({
                ...cliente,
                coche:
                    cliente.coches.length > 0
                        ? `${cliente.coches[0]?.marca} ${cliente.coches[0]?.modelo}`
                        : "-",
                matricula: cliente.coches[0]?.matricula || "-",
                fecha_entrada: new Date(
                    cliente.fecha_entrada
                ).toLocaleDateString("es-ES"),
                fecha_salida: cliente.fecha_salida
                    ? new Date(cliente.fecha_salida).toLocaleDateString("es-ES")
                    : "-",
            }));

            setAllClients(clientesFinalData);
            setFilteredClients(
                clientesFinalData.filter(
                    (c) => c.fecha_salida === "-" || c.fecha_salida === null
                )
            );
            setLoading(false);
        };

        fetchClientes();
    }, [supabase]);

    useEffect(() => {
        filterClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOption, allClients]);

    const filterClients = () => {
        switch (filterOption) {
            case "activos":
                setFilteredClients(
                    allClients.filter(
                        (c) => c.fecha_salida === "-" || c.fecha_salida === null
                    )
                );
                break;
            case "inactivos":
                setFilteredClients(
                    allClients.filter(
                        (c) => c.fecha_salida !== "-" && c.fecha_salida !== null
                    )
                );
                break;
            case "todos":
                setFilteredClients(allClients);
                break;
            default:
                setFilteredClients(allClients);
        }
    };

    return (
        <div className="flex flex-col justify-center ms-5 mt-10">
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-sm text-gray-500 mb-3">
                Aquí puedes ver la lista de clientes registrados.
            </p>
            <Separator className="my-4 " />
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mb-3 w-full max-w-4xl">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-500/80 transition"
                    onClick={() => router.push("clientes/crear")}
                >
                    <div className="flex gap-1 align-middle">
                        Añadir <PlusIcon className="w-4" />
                    </div>
                </button>

                <div className="flex items-center gap-4">
                    <Label
                        htmlFor="filterSelect"
                        className="text-sm font-medium"
                    >
                        Filtrar clientes:
                    </Label>
                    <Select
                        value={filterOption}
                        onValueChange={(value) =>
                            setFilterOption(value as ClientesFilter)
                        }
                    >
                        <SelectTrigger className="w-32" id="filterSelect">
                            <SelectValue placeholder="Seleccionar filtro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ClientesFilter.Activos}>
                                Activos
                            </SelectItem>
                            <SelectItem value={ClientesFilter.Inactivos}>
                                Antiguos
                            </SelectItem>
                            <SelectItem value={ClientesFilter.Todos}>
                                Todos
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex-1 w-full max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                {loading ? (
                    <LoadingSpin heightContainer={20} />
                ) : (
                    <DataTable columns={columns} data={filteredClients} />
                )}
            </div>
        </div>
    );
};

export default ClientesView;
