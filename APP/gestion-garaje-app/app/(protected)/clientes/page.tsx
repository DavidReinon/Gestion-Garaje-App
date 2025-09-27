"use client";

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import LoadingSpin from "@/components/loading-spin";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { set } from "date-fns";

const ClientesView: FC = () => {
    type Cliente = Tables<"clientes"> & {
        coche?: string;
        matricula?: string;
    };

    const [allClients, setAllClients] = useState<Cliente[]>([]);
    const [filteredClients, setFilteredClients] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showActiveClients, setShowActiveClients] = useState<boolean>(true);
    const [showInactiveClients, setShowInactiveClients] =
        useState<boolean>(false);

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
    }, [supabase]); // Se ejecutará al montar el componente, igual que sin dependencias '[]'

    const filterClients = () => {
        if (showActiveClients && !showInactiveClients) {
            setFilteredClients(
                allClients.filter(
                    (c) => c.fecha_salida === "-" || c.fecha_salida === null
                )
            );
            return;
        }

        if (!showActiveClients && showInactiveClients) {
            //TODO: Hacer también que se compare si la fecha de salida es superior a la fecha actual,
            // para que si un cliente tiene una fecha de salida en el futuro, se considere activo
            setFilteredClients(
                allClients.filter(
                    (c) => c.fecha_salida !== "-" && c.fecha_salida !== null
                )
            );
            return;
        }
        setFilteredClients(allClients);
    };

    return (
        <div className="flex flex-col justify-center ms-5 mt-10">
            <h1 className="text-2xl font-bold mb-2">Clientes</h1>
            <p className="text-sm text-gray-500 mb-3">
                Aquí puedes ver la lista de clientes registrados.
            </p>
            <div className="flex-1 max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                <div className="flex justify-start mb-3">
                    <button
                        //TODO:: Cambiar hover a mas claro
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => router.push("clientes/crear")}
                    >
                        <div className="flex gap-1 align-middle">
                            <PlusIcon className="w-4" /> Añadir
                        </div>
                    </button>
                    <div className="flex flex-1 justify-end items-center gap-12">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={showInactiveClients}
                                onCheckedChange={() =>
                                    setShowInactiveClients(!showInactiveClients)
                                }
                                id="showInactiveClients"
                                onClick={filterClients}
                            />
                            <Label
                                htmlFor="showInactiveClients"
                                className="text-sm font-medium leading-none"
                            >
                                Mostrar Clientes Antiguos
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={showActiveClients}
                                onCheckedChange={() =>
                                    setShowActiveClients(!showActiveClients)
                                }
                                id="showActiveClients"
                                onClick={filterClients}
                            />
                            <Label
                                htmlFor="showActiveClients"
                                className="text-sm font-medium leading-none"
                            >
                                Mostrar Clientes Activos
                            </Label>
                        </div>
                    </div>
                </div>
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
