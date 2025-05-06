"use client"; // Para usar hooks en un componente de Next.js 13+

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Importamos Supabase desde utils
import { DataTable } from "@/components/data-table";
import { getColumns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase"; // Importamos el tipo Tables desde utils
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

const ClientesView: FC = () => {
    type Cliente = Tables<"clientes"> & {
        coche?: string;
        matricula?: string;
    };

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

            setClientes(clientesFinalData);
            setLoading(false);
        };

        fetchClientes();
    }, [supabase]); // Se ejecutará al montar el componente, igual que sin dependencias '[]'

    return (
        <div className="flex justify-center ms-5 mt-10">
            <div className="flex-1 max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                <h1 className="text-2xl font-bold mb-2">Clientes</h1>
                <p className="text-sm text-gray-500 mb-3">
                    Aquí puedes ver la lista de clientes registrados.
                </p>
                <div className="flex justify-start mb-3">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => router.push("clientes/crear")}
                    >
                        <div className="flex gap-1 align-middle">
                            <PlusIcon className="w-4" /> Añadir
                        </div>
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DataTable columns={columns} data={clientes} />
                )}
            </div>
        </div>
    );
};

export default ClientesView;
