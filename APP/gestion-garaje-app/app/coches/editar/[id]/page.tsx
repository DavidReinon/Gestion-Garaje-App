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

const spainMatriculaRegex = /^[0-9]{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

const carSchema = z
    .object({
        marca: z.string().min(1, "La marca es obligatoria"),
        modelo: z.string().min(1, "El modelo es obligatorio"),
        matricula: z.string().min(1, "La matrícula es obligatoria"),
        año: z.coerce
            .number()
            .min(1900, "El año no puede ser menor a 1900")
            .max(
                new Date().getFullYear(),
                "El año no puede ser mayor al año actual"
            )
            .optional(),
        color: z.string().optional(),
        tipo: z.enum(["Hibrido", "Electrico", "Estandar"]).optional(),
        numero_plaza: z.coerce
            .number()
            .min(1, "El número de plaza debe ser mayor a 0"),
        cliente_id: z.coerce.number().min(1, "El cliente es obligatorio"),
    })
    .refine(
        ({ matricula }, { parent }) =>
            !parent.isSpainMatricula || spainMatriculaRegex.test(matricula),
        {
            message:
                "La matrícula debe ser válida para España (formato: 1234 BCD)",
            path: ["matricula"],
        }
    );

type CarFormData = z.infer<typeof carSchema>;

const EditarCoche: FC = () => {
    const supabase = createClient();
    const router = useRouter();
    const params = useParams();
    const carId = params?.id;

    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [initialData, setInitialData] = useState<CarFormData | null>(null);
    const [isSpainMatricula, setIsSpainMatricula] = useState(true);

    const form = useForm<CarFormData>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            marca: "",
            modelo: "",
            matricula: "",
            año: undefined,
            color: "",
            tipo: "Estandar",
            numero_plaza: 0,
            cliente_id: 0,
        },
        context: { isSpainMatricula },
    });

    useEffect(() => {
        const fetchCar = async () => {
            if (!carId) return;
            const { data, error } = await supabase
                .from("coches")
                .select("*")
                .eq("id", carId)
                .single();

            if (error) {
                console.error("Error al obtener coche:", error);
                return;
            }

            setInitialData(data);
            form.reset(data);
        };

        const fetchClientes = async () => {
            const { data, error } = await supabase.from("clientes").select("*");

            if (error) {
                console.error("Error al obtener clientes:", error);
                return;
            }

            setClientes(data || []);
        };

        fetchCar();
        fetchClientes();
    }, [carId, supabase, form]);

    const onSubmit = async (data: CarFormData) => {
        setLoading(true);

        const payload: TablesUpdate<"coches"> = {
            ...data,
        };

        const { error } = await supabase
            .from("coches")
            .update(payload)
            .eq("id", carId);

        if (error) {
            console.error("Error al actualizar coche:", error);
            alert(`Hubo un error al actualizar el coche.\n${error.message}`);
            setLoading(false);
            return;
        }

        alert("Coche actualizado exitosamente.");
        router.push("/coches");
        setLoading(false);
    };

    if (!initialData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-0 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center my-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-fit w-full"
                >
                    <h1 className="text-2xl font-bold">Editar Coche</h1>

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
                    </div>

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
                                Formato Matrícula Española
                            </Label>
                        </div>
                    </div>

                    <div className="flex gap-4">
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
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="numero_plaza"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nº Plaza *</FormLabel>
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
                                <FormItem>
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
                                                        id,
                                                        nombre,
                                                        apellidos,
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
                    </div>

                    <Button className="mt-5" type="submit" disabled={loading}>
                        {loading ? "Actualizando..." : "Actualizar Coche"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default EditarCoche;
