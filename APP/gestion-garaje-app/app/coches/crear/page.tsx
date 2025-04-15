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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Definición del esquema de validación con Zod
const carSchema = z.object({
    marca: z.string().min(1, "La marca es obligatoria"),
    modelo: z.string().min(1, "El modelo es obligatorio"),
    matricula: z
        .string()
        .regex(/^[A-Z0-9]{1,10}$/, "La matrícula debe ser válida")
        .min(1, "La matrícula es obligatoria"),
    año: z
        .number()
        .int()
        .min(1900, "El año debe ser mayor o igual a 1900")
        .max(new Date().getFullYear(), "El año no puede ser mayor al actual")
        .optional(),
    color: z.string().optional(),
    tipo: z.enum(["Hibrido", "Electrico", "Estandar"]).optional(),
    cliente_id: z.number().int().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

const CrearCoche = () => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Inicialización del formulario con react-hook-form y zodResolver
    const form = useForm<CarFormData>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            matricula: "",
            año: undefined,
            color: "",
            tipo: undefined,
            cliente_id: undefined,
        },
    });

    // Manejo del envío del formulario
    const onSubmit = async (data: CarFormData) => {
        setLoading(true);
        const payload: TablesInsert<"coches"> = {
            ...data,
        };

        const { error } = await supabase.from("coches").insert([payload]);

        if (error) {
            console.error("Error al crear coche:", error);
            alert(`Hubo un error al crear el coche.\n${error.message}`);
            setLoading(false);
            return;
        }

        alert("Coche creado exitosamente.");
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
                    <h1 className="text-2xl font-bold">Crear Coche</h1>
                    <FormDescription>
                        Los campos marcados con * son obligatorios
                    </FormDescription>

                    <FormField
                        control={form.control}
                        name="marca"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Marca" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Modelo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="matricula"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Matrícula *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Matrícula" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="año"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Año</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Año"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="Color" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hibrido">
                                                Híbrido
                                            </SelectItem>
                                            <SelectItem value="Electrico">
                                                Eléctrico
                                            </SelectItem>
                                            <SelectItem value="Estandar">
                                                Estándar
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cliente_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID del Cliente</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="ID del Cliente"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear Coche"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CrearCoche;
