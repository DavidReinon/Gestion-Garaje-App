"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TablesInsert } from "@/utils/types/supabase";
import formatToLocalTimeZoneString from "@/utils/date-helper";
import ClientesForm, {
    ClientFormData,
} from "@/features/clientes/components/ClientesForm";

const CrearCliente: FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: ClientFormData) => {
        setLoading(true);
        const payload: TablesInsert<"clientes"> = {
            ...data,
            fecha_entrada: formatToLocalTimeZoneString(data.fecha_entrada),
            fecha_salida: data.fecha_salida
                ? formatToLocalTimeZoneString(data.fecha_salida)
                : null,
        };

        const { error } = await supabase.from("clientes").insert([payload]);

        if (error) {
            console.error("Error al crear cliente:", error);
            alert(`Hubo un error al crear el cliente.\n${error.message}`);
            setLoading(false);
            return;
        }
        router.push("/coches/crear");
        alert("Cliente creado exitosamente.");
        setLoading(false);
    };

    return (
        <div className="flex justify-center my-10">
            <ClientesForm
                title="Crear Cliente"
                onSubmit={onSubmit}
                onCancel={() => router.push("/clientes")}
                loading={loading}
                submitButtonText="Crear"
                submitButtonLoadingText="Creando..."
                showDescription
            />
        </div>
    );
};

export default CrearCliente;
