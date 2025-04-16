"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables, TablesInsert } from "@/utils/types/supabase";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";

// Definición del esquema de validación con Zod
const carSchema = z
    .object({
        marca: z.string().min(1, "La marca es obligatoria"),
        modelo: z.string().min(1, "El modelo es obligatorio"),
        matricula: z.string().min(1, "La matrícula es obligatoria"),
        año: z.string().optional(),
        color: z.string().optional(),
        tipo: z.enum(["Hibrido", "Electrico", "Estandar"]).optional(),
        numero_plaza: z.string().optional(),
        cliente_id: z.string().min(1, "El cliente es obligatorio"),
    })
    .refine(
        ({ año }) => {
            const parsedYear = año ? Number(año) : null;
            return !parsedYear || parsedYear >= 1900;
        },
        {
            message: "El año no puede ser menor a 1900",
            path: ["año"],
        }
    )
    .refine(
        ({ año }) => {
            const currentYear = new Date().getFullYear();
            const parsedYear = año ? Number(año) : null;
            return !parsedYear || parsedYear <= currentYear;
        },
        {
            message: "El año no puede ser mayor al año actual",
            path: ["año"],
        }
    )
    //TODO
    .refine(
        ({ numero_plaza }) => {
            const parsedPlaza = numero_plaza ? Number(numero_plaza) : null;
            console.log(parsedPlaza);
            console.log(parsedPlaza! > 0);
            return !parsedPlaza || parsedPlaza > 0;
        },
        {
            message: "El número de plaza debe ser mayor a 0",
            path: ["numero_plaza"], // Asegúrate de que coincida con el nombre del campo
        }
    );
const spainMatriculaRegex = /^[0-9]{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

type CarFormData = z.infer<typeof carSchema>;
type Cliente = Tables<"clientes">;

const CrearCoche: React.FC = () => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isSpainMatricula, setIsSpainMatricula] = useState(true);

    useEffect(() => {
        const fetchClientes = async () => {
            const { data, error } = await supabase.from("clientes").select("*");

            if (error) {
                console.error("Error al obtener clientes:", error);
                return;
            }

            setClientes(data || []);
        };

        fetchClientes();
    }, [supabase]);

    const form = useForm<CarFormData>({
        resolver: zodResolver(
            carSchema.refine(
                (
                    { matricula } //False para hacer la validación
                ) => !isSpainMatricula || spainMatriculaRegex.test(matricula),
                {
                    message: isSpainMatricula
                        ? "La matrícula debe ser válida para España (formato: 1234 BCD)"
                        : undefined,
                    path: ["matricula"],
                }
            )
        ),
        defaultValues: {
            marca: "",
            modelo: "",
            matricula: "",
            año: "2000",
            color: "",
            numero_plaza: "",
            tipo: "Estandar",
            cliente_id: "",
        },
    });

    const onSubmit = async (data: CarFormData) => {
        setLoading(true);
        const payload: TablesInsert<"coches"> = {
            ...data,
            cliente_id: parseInt(data.cliente_id),
            año: data.año ? parseInt(data.año) : null,
            numero_plaza: data.numero_plaza
                ? parseInt(data.numero_plaza)
                : null,
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={isSpainMatricula}
                            onCheckedChange={() =>
                                setIsSpainMatricula(!isSpainMatricula)
                            }
                            id="spainMatricula"
                        />
                        <Label
                            htmlFor="spainMatricula"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Formato Matricula Española
                        </Label>
                    </div>

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
                        name="numero_plaza"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nº Plaza</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nº Plaza"
                                        {...field}
                                    />
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
                                <FormLabel>Dueño del Coche *</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el dueño" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map(
                                                ({
                                                    nombre,
                                                    apellidos,
                                                    id,
                                                    telefono,
                                                }) => (
                                                    <SelectItem
                                                        key={id}
                                                        value={id.toString()}
                                                    >
                                                        {`${nombre} ${apellidos} - ${telefono}`}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
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
