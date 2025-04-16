"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TablesInsert } from "@/utils/types/supabase";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/date-picker";

// Definición del esquema de validación con Zod
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
            .min(9, "El teléfono debe tener al menos 9 numeros")
            .max(9, "El teléfono debe tener como máximo 9 numeros")
            .regex(/^\d{9}$/, "El teléfono debe contener solo números"),
        direccion: z.string().min(1, "La dirección es obligatoria"),
        dni: z.string().min(9, "El DNI es obligatorio"),
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
            !fecha_salida || // Si `fecha_salida` es undefined, no se valida
            fecha_salida >= fecha_entrada, // Si existe, debe ser mayor o igual a `fecha_entrada`
        {
            message:
                "La fecha de salida no puede ser anterior a la fecha de entrada",
            path: ["fecha_salida"],
        }
    );

type ClientFormData = z.infer<typeof clientSchema>;

const CrearCliente = () => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Inicialización del formulario con react-hook-form y zodResolver
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
            codigo_postal: "46470",
            poblacion: "Catarroja",
            provincia: "Valencia",
            observaciones: "",
            fecha_entrada: undefined,
            fecha_salida: undefined,
        },
    });

    // Manejo del envío del formulario
    const onSubmit = async (data: ClientFormData) => {
        setLoading(true);
        const payload: TablesInsert<"clientes"> = {
            ...data,
            fecha_entrada: data.fecha_entrada.toISOString(),
            fecha_salida: data.fecha_salida?.toISOString() ?? null,
        };

        const { error } = await supabase.from("clientes").insert([payload]);

        if (error) {
            console.error("Error al crear cliente:", error);
            alert(`Hubo un error al crear el cliente.\n${error.message}`);
            setLoading(false);
            return;
        }

        alert("Cliente creado exitosamente.");
        form.reset();

        setLoading(false);
    };

    return (
        <div className="flex justify-center mt-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-md w-full"
                >
                    <h1 className="text-2xl font-bold">Crear Cliente</h1>
                    <FormDescription>
                        Los campos marcados con * son obligatorios
                    </FormDescription>

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
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear Cliente"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CrearCliente;
