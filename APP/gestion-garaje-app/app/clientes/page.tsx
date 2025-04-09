"use client"; // Para usar hooks en un componente de Next.js 13+

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Importamos Supabase desde utils
import { DataTable } from "@/components/data-table";
import { columns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase"; // Importamos el tipo Tables desde utils

const ClientesView: FC = () => {
    type Cliente = Tables<"clientes"> & {
        coche?: string;
        matricula?: string;
    };

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("clientes")
                .select(`*, coches (
                    marca, modelo, matricula)`); // Hacemos el JOIN con coches

            if (error) {
                console.error("Error al obtener clientes:", error);
                setLoading(false);
                return;
            }

            console.log(data);
            const clientesConCoche = data.map((cliente) => ({
                ...cliente,
                coche: cliente.coches
                    ? `${cliente.coches[0]?.marca} ${cliente.coches[0]?.modelo}`
                    : "-",
                matricula: cliente.coches[0]?.matricula || "-",
            }));

            setClientes(clientesConCoche);
            setLoading(false);
        };

        fetchClientes();
    }, [supabase]); // Se ejecutará al montar el componente, igual que sin dependencias '[]'

    const clientesDatosPrueba: Cliente[] = [
        {
            id: 1,
            nombre: "Carlos",
            apellidos: "Martínez",
            email: "carlos@ejemplo.com",
            telefono: "600123456",
            direccion: "Calle Falsa 123",
            fecha_entrada: "2024-03-01",
            fecha_salida: null,
            coche: "Toyota Corolla",
            matricula: "1234-ABC",
        },
        {
            id: 2,
            nombre: "Laura",
            apellidos: "Gómez",
            email: "laura@ejemplo.com",
            telefono: "611234567",
            direccion: "Av. del Garaje 45",
            fecha_entrada: "2024-02-10",
            fecha_salida: "2024-03-01",
            coche: "Honda Civic",
            matricula: "5678-DEF",
        },
        {
            id: 3,
            nombre: "Martina",
            apellidos: "Gómez",
            email: "martina@ejemplo.com",
            telefono: "622345678",
            direccion: "Av. del Garaje 46",
            fecha_entrada: "2024-02-15",
            fecha_salida: "2024-03-05",
            coche: "Ford Focus",
            matricula: "9101-GHI",
        },
        {
            id: 4,
            nombre: "Laura",
            apellidos: "Gómez",
            email: "laura2@ejemplo.com",
            telefono: "633456789",
            direccion: "Av. del Garaje 47",
            fecha_entrada: "2024-02-20",
            fecha_salida: "2024-03-10",
            coche: "Volkswagen Golf",
            matricula: "1121-JKL",
        },
    ];

    return (
        <div className="flex justify-center ms-5 mt-10 w-full">
            <div className="flex-1 max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                <h1 className="text-2xl font-bold mb-2">Lista de Clientes</h1>
                <p className="text-sm text-gray-500 mb-3">
                    Aquí puedes ver la lista de clientes y sus coches.
                </p>
                <div className="flex justify-start mb-3">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Añadir
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
