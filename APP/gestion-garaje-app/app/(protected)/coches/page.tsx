"use client";

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import LoadingSpin from "@/components/loading-spin";

const CochesView: FC = () => {
    type Coche = Tables<"coches">;

    const [coches, setCoches] = useState<Coche[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();
    const router = useRouter();
    const columns = getColumns(supabase, router);

    useEffect(() => {
        const fetchCoches = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("coches")
                .select(`*, clientes (
                nombre, apellidos, telefono )`); // Hacemos el JOIN con cliente

            if (error) {
                console.error("Error al obtener coches:", error);
                setLoading(false);
                return;
            }

            console.log(data);
            const cochesConDueño = data.map((coche) => ({
                ...coche,
                dueño: coche.clientes
                    ? `${coche.clientes?.nombre} ${coche.clientes?.apellidos}`
                    : "-",
                telefono: coche.clientes?.telefono || "-",
            }));

            setCoches(cochesConDueño);
            setLoading(false);
        };

        fetchCoches();
    }, [supabase]);

    return (
        <div className="flex justify-center ms-5 mt-10 w-full">
            <div className="flex-1 max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                <h1 className="text-2xl font-bold mb-2">Coches</h1>
                <p className="text-sm text-gray-500 mb-3">
                    Aquí puedes ver la lista de coches registrados.
                </p>
                <div className="flex justify-start mb-3">
                    <button
                        onClick={() => router.push("coches/crear")}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        <div className="flex gap-1 align-middle">
                            <PlusIcon className="w-4" /> Añadir
                        </div>
                    </button>
                </div>
                {loading ? (
                    <LoadingSpin heightContainer={20} /> 
                ) : (
                    <DataTable columns={columns} data={coches} />
                )}
            </div>
        </div>
    );
};

export default CochesView;
