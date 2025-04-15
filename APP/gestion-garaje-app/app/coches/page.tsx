"use client";

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DataTable } from "@/components/data-table";
import { columns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase";
import { useRouter } from "next/navigation";

const CochesView: FC = () => {
    type Coche = Tables<"coches">;

    const [coches, setCoches] = useState<Coche[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();
    const router = useRouter();

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
                dueño: coche.clientes > 0
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
                <h1 className="text-2xl font-bold mb-2">Lista de Coches</h1>
                <p className="text-sm text-gray-500 mb-3">
                    Aquí puedes ver la lista de coches registrados.
                </p>
                <div className="flex justify-start mb-3">
                    <button onClick={() => router.push("coches/crear")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Añadir
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <DataTable columns={columns} data={coches} />
                )}
            </div>
        </div>
    );
};

export default CochesView;
