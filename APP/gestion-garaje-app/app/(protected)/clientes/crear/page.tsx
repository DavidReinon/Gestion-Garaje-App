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

    const onSubmit = async (clientFormData: ClientFormData) => {
        setLoading(true);
        const payload: TablesInsert<"clientes"> = {
            ...clientFormData,
            fecha_entrada: formatToLocalTimeZoneString(
                clientFormData.fecha_entrada
            ),
            fecha_salida: clientFormData.fecha_salida
                ? formatToLocalTimeZoneString(clientFormData.fecha_salida)
                : null,
        };

        // Get inserted id and redirect with cliente_id
        const { data: insertedData, error } = await supabase
            .from("clientes")
            .insert(payload)
            .select("id")
            .single();

        if (error) {
            console.error("Error al crear cliente:", error);
            alert(`Hubo un error al crear el cliente.\n${error.message}`);
            setLoading(false);
            return;
        }

        router.push(
            insertedData?.id
                ? `/coches/crear?cliente_id=${insertedData.id}`
                : "/coches/crear"
        );
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
