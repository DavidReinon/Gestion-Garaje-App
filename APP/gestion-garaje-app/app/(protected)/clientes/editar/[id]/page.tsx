"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TablesUpdate } from "@/utils/types/supabase";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";
import formatToLocalTimeZoneString from "@/utils/date-helper";
import LoadingSpin from "@/components/loading-spin";
import ClientesForm from "@/features/clientes/components/ClientesForm";

const clientSchema = z
    .object({
        nombre: z.string().min(1, "El nombre es obligatorio"),
        apellidos: z.string().optional(),
        email: z
            .string()
            .email("Correo electrónico inválido")
            .or(z.literal(""))
            .optional(),
        telefono: z
            .string()
            .min(9, "El teléfono debe tener al menos 9 números")
            .max(9, "El teléfono debe tener como máximo 9 números")
            .regex(/^\d{9}$/, "El teléfono debe contener solo números"),
        direccion: z.string().min(1, "La dirección es obligatoria"),
        dni: z
            .string()
            .min(9, "El DNI debe no puede tener menos de 9 caracteres.")
            .max(9, "El DNI no puede tener más de 9 caracteres."),
        numero_cuenta_iban: z.string().min(1, "El IBAN es obligatorio"),
        codigo_postal: z
            .string()
            .min(
                5,
                "El código postal es obligatorio. Debe contener 5 numeros."
            ),
        poblacion: z.string().min(1, "La población es obligatoria"),
        provincia: z.string().min(1, "La provincia es obligatoria"),
        observaciones: z.string().optional(),
        fecha_entrada: z.date({
            required_error: "La fecha de entrada es obligatoria",
        }),
        fecha_salida: z.date().optional(),
    })
    .refine(
        ({ fecha_entrada, fecha_salida }) =>
            !fecha_salida || fecha_salida >= fecha_entrada,
        {
            message:
                "La fecha de salida no puede ser anterior a la fecha de entrada",
            path: ["fecha_salida"],
        }
    );

type ClientFormData = z.infer<typeof clientSchema>;

const EditarCliente: FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const params = useParams();
    const clientId = params?.id;

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<ClientFormData | null>(null);

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            nombre: "",
            apellidos: "",
            email: "",
            telefono: "",
            direccion: "",
            dni: "",
            numero_cuenta_iban: "",
            codigo_postal: "",
            poblacion: "",
            provincia: "",
            observaciones: "",
            fecha_entrada: undefined,
            fecha_salida: undefined,
        },
    });

    useEffect(() => {
        const fetchClient = async () => {
            if (!clientId) return console.log("!! no ID");
            const { data, error } = await supabase
                .from("clientes")
                .select("*")
                .eq("id", clientId)
                .single();

            if (error) {
                console.error("Error al obtener cliente:", error);
                return;
            }

            console.log(data);

            setInitialData(data);
            form.reset({
                ...data,
                fecha_entrada: data.fecha_entrada
                    ? new Date(data.fecha_entrada)
                    : undefined,
                fecha_salida: data.fecha_salida
                    ? new Date(data.fecha_salida)
                    : undefined,
            });
        };

        fetchClient();
    }, [clientId, supabase, form]);

    const onSubmit = async (data: ClientFormData) => {
        setLoading(true);

        const payload: TablesUpdate<"clientes"> = {
            ...data,
            fecha_entrada: formatToLocalTimeZoneString(data.fecha_entrada),
            fecha_salida: data.fecha_salida
                ? formatToLocalTimeZoneString(data.fecha_salida)
                : null,
        };

        const { error } = await supabase
            .from("clientes")
            .update(payload)
            .eq("id", clientId);

        if (error) {
            console.error("Error al actualizar cliente:", error);
            alert(`Hubo un error al actualizar el cliente.\n${error.message}`);
            setLoading(false);
            return;
        }

        alert("Cliente actualizado exitosamente.");
        router.push("/clientes");
        setLoading(false);
    };

    if (!initialData) {
        return <LoadingSpin heightContainer={"screen"} />;
    }

    return (
        <div className="flex justify-center my-10">
            <ClientesForm
                title="Editar Cliente"
                onCancel={() => router.push("/clientes")}
                onSubmit={onSubmit}
                submitButtonText="Actualizar"
                submitButtonLoadingText="Actualizando..."
                loading={loading}
                showDescription
                initialValues={initialData}
            />
        </div>
    );
};

export default EditarCliente;
