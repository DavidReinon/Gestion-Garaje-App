"use client"; // Para usar hooks en un componente de Next.js 13+

import { FC, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Importamos Supabase desde utils

const ClientesView: FC = () => {
    const [clientes, setClientes] = useState([]);
    const supabase = createClient(); // Creamos una instancia de Supabase

    useEffect(() => {
        const fetchClientes = async () => {
            const { data, error } = await supabase.from("clientes").select("*");
            if (error) console.error("Error al obtener clientes:", error);
            else setClientes(data);
        };

        fetchClientes();
    }, []);

    return (
        <div>
            <h1>Lista de Clientes</h1>
            <ul>
                {clientes.map((cliente) => (
                    <li key={cliente.id}>
                        {cliente.nombre} {cliente.apellidos} - {cliente.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientesView;
