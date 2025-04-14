"use client"; // Para usar hooks en un componente de Next.js 13+

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Importamos Supabase desde utils
import { DataTable } from "@/components/data-table";
import { columns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase"; // Importamos el tipo Tables desde utils
import { useRouter } from "next/navigation";

const ClientesView: FC = () => {
    type Cliente = Tables<"clientes"> & {
        coche?: string;
        matricula?: string;
    };

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const supabase = createClient();
    const router = useRouter();

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
            apellidos: "García López",
            codigo_postal: "28001",
            direccion: "Calle Mayor, 10",
            dni: "12345678A",
            email: "garcia.lopez@example.com",
            fecha_entrada: "2023-01-15",
            fecha_salida: null,
            id: 1,
            nombre: "Juan",
            numero_cuenta_iban: "ES9121000418450200051332",
            numero_plaza: 5,
            observaciones: null,
            poblacion: "Madrid",
            provincia: "Madrid",
            telefono: "600123456",
        },
        {
            apellidos: "Martínez Pérez",
            codigo_postal: "46001",
            direccion: "Avenida del Puerto, 25",
            dni: "87654321B",
            email: "martinez.perez@example.com",
            fecha_entrada: "2023-02-10",
            fecha_salida: "2023-02-20",
            id: 2,
            nombre: "Ana",
            numero_cuenta_iban: "ES7621000418450200056789",
            numero_plaza: 12,
            observaciones: null,
            poblacion: "Valencia",
            provincia: "Valencia",
            telefono: "650987654",
        },
        {
            apellidos: "Fernández Gómez",
            codigo_postal: "41001",
            direccion: "Plaza Nueva, 3",
            dni: "11223344C",
            email: "fernandez.gomez@example.com",
            fecha_entrada: "2023-03-05",
            fecha_salida: null,
            id: 3,
            nombre: "Luis",
            numero_cuenta_iban: "ES3021000418450200067890",
            numero_plaza: 8,
            observaciones: "Prefiere contacto por email",
            poblacion: "Sevilla",
            provincia: "Sevilla",
            telefono: "620123789",
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
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => router.push("clientes/crear")}
                    >
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
