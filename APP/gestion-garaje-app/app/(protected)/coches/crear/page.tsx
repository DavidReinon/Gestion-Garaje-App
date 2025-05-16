"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import {
    carSchema,
    defaultValues,
    spainMatriculaRegex,
    type CarFormDataType,
} from "@/app/(protected)/coches/domain/carSchema";

type Cliente = Tables<"clientes">;

const CrearCoche: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();

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

    const form = useForm<CarFormDataType>({
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
            ...defaultValues,
        },
    });

    const onSubmit = async (data: CarFormDataType) => {
        setLoading(true);
        const payload: TablesInsert<"coches"> = {
            ...data,
            numero_plaza: data.numero_plaza === "" ? null : data.numero_plaza,
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

        router.push("/coches");
        setLoading(false);
    };

    return (
        <div className="flex justify-center my-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-fit w-full"
                >
                    <h1 className="text-2xl font-bold">Crear Coche</h1>
                    <FormDescription>
                        Los campos marcados con * son obligatorios
                    </FormDescription>

                    <div className="flex gap-4">
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
                                        <Input
                                            placeholder="Modelo"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-4 items-center">
                            <FormField
                                control={form.control}
                                name="matricula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Matrícula *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Matrícula"
                                                {...field}
                                            />
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
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="año"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
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
                                <FormItem className="flex-1 min-w-[120px]">
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
                                <FormItem className="flex-1 min-w-[120px]">
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
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="numero_plaza"
                            render={({ field }) => (
                                <FormItem className="min-w-[120px]">
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
                            name="cliente_id"
                            render={({ field }) => (
                                <FormItem className="flex-1 min-w-[120px]">
                                    <FormLabel>Dueño del Coche *</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value?.toString()}
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
                                                        dni,
                                                    }) => (
                                                        <SelectItem
                                                            key={id}
                                                            value={id.toString()}
                                                        >
                                                            {`${nombre} ${apellidos} - ${dni}`}
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
                    </div>

                    <Button className="mt-5" type="submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear Coche"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CrearCoche;
