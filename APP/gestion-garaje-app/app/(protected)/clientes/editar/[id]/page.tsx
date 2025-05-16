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
        return (
            <LoadingSpin heightContainer={'screen'} /> 
        );
    }

    return (
        <div className="flex justify-center my-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-fit w-full"
                >
                    <h1 className="text-2xl font-bold">Editar Cliente</h1>

                    {/* Nombre y Apellidos */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Nombre *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nombre"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apellidos"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Apellidos</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Apellidos"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Teléfono y DNI */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Teléfono *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Teléfono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dni"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>DNI *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="DNI" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Email y Dirección */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dirección" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Código Postal, Población, Provincia */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="codigo_postal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código Postal *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Código Postal"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="poblacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Población *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Población"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="provincia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provincia *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Provincia"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* IBAN */}
                    <FormField
                        control={form.control}
                        name="numero_cuenta_iban"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>IBAN *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Número de cuenta IBAN"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Observaciones */}
                    <FormField
                        control={form.control}
                        name="observaciones"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Observaciones del cliente"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fechas */}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="fecha_entrada"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Fecha de Entrada *</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            required
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fecha_salida"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Fecha de Salida</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button className="mt-5" type="submit" disabled={loading}>
                        {loading ? "Actualizando..." : "Actualizar Cliente"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditarCliente;
