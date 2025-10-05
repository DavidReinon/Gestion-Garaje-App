"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Esquema basado en crear/page.tsx
export const clientSchema = z
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
            //En el caso de que esta validación no se cumpla (sea false), se lanza el message:
            !fecha_salida || fecha_salida >= fecha_entrada,
        {
            message:
                "La fecha de salida no puede ser anterior a la fecha de entrada",
            path: ["fecha_salida"],
        }
    );

export type ClientFormData = z.infer<typeof clientSchema>;

interface Props {
    title: string;
    onSubmit: (data: ClientFormData) => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    submitButtonText?: string;
    submitButtonLoadingText?: string;
    showDescription?: boolean;
    initialValues?: Partial<ClientFormData>;
}

const baseDefaults: ClientFormData = {
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
    fecha_entrada: undefined as unknown as Date,
    fecha_salida: undefined,
};

const normalizeDate = (v: unknown) =>
    typeof v === "string" ? new Date(v) : (v as Date | undefined);

const ClientesForm: FC<Props> = ({
    title,
    onSubmit,
    onCancel,
    loading = false,
    submitButtonText = "Aceptar",
    submitButtonLoadingText = "Guardando...",
    showDescription = true,
    initialValues = {},
}) => {
    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            ...baseDefaults,
            ...initialValues,
            fecha_entrada:
                normalizeDate(initialValues.fecha_entrada) ??
                baseDefaults.fecha_entrada,
            fecha_salida:
                normalizeDate(initialValues.fecha_salida) ??
                baseDefaults.fecha_salida,
        },
    });

    return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(async (data) => {
                        await onSubmit(data);
                    })}
                    className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-fit w-full"
                >
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {showDescription && (
                        <FormDescription>
                            Los campos marcados con * son obligatorios
                        </FormDescription>
                    )}

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

                    <div className="w-full flex flex-wrap gap-4">
                        <FormField
                            control={form.control}
                            name="codigo_postal"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
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
                                <FormItem className="flex-1 min-w-[120px]">
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
                                <FormItem className="flex-1 min-w-[120px]">
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

                    <div className="w-full flex gap-4">
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

                    <div className="flex mt-5 justify-center gap-2">
                        <Button
                            type="button"
                            className="w-full bg-destructive hover:bg-destructive/80"
                            disabled={loading}
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? (submitButtonLoadingText ?? "Guardando...")
                                : (submitButtonText ?? "Aceptar")}
                        </Button>
                    </div>
                </form>
            </Form>
    );
};

export default ClientesForm;
