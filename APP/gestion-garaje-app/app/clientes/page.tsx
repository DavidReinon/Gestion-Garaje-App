"use client"; // Para usar hooks en un componente de Next.js 13+

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Importamos Supabase desde utils
import { DataTable } from "@/components/data-table";
import { columns } from "./domain/columns";
import { Tables } from "@/utils/types/supabase";

const ClientesView: FC = () => {
    type Cliente = Tables<"clientes"> & {
        coche?: string;
        matricula?: string;
    };

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const supabase = createClient(); // Creamos una instancia de Supabase

    useEffect(() => {
        const fetchClientes = async () => {
            const { data, error } = await supabase.from("clientes")
                .select(`*, coches (
                    marca, modelo, matricula)`); // Hacemos el JOIN con coches

            if (error) {
                console.error("Error al obtener clientes:", error);
                return; // Salimos de la función si hay un error
            }

            console.log(data);
            const clientesConCoche = data.map((cliente) => ({
                ...cliente,
                coche: cliente.coches
                    ? `${cliente.coches.marca} ${cliente.coches.modelo}`
                    : "-",
                matricula: cliente.coches,
            }));

            setClientes(clientesConCoche);
        };

        fetchClientes();
    }, []);

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
            fecha_registro_bd: "2024-03-01T12:00:00Z",
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
            fecha_registro_bd: "2024-02-10T10:30:00Z",
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
            fecha_registro_bd: "2024-02-15T11:00:00Z",
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
            fecha_registro_bd: "2024-02-20T12:30:00Z",
            coche: "Volkswagen Golf",
            matricula: "1121-JKL",
        },
    ];

    return (
        <div className="flex justify-center ms-5 w-full">
            <div className="flex-1 max-w-4xl p-4 rounded-lg bg-neutral-50 shadow-md overflow-x-auto">
                <h1 className="text-2xl font-bold mb-3">Lista de Clientes</h1>
                {/* Contenedor para hacer la tabla scrollable */}
                <DataTable columns={columns} data={clientes} />
            </div>
        </div>
    );
};

export default ClientesView;
