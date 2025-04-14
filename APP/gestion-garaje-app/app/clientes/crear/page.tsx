"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import DatePicker from "@/components/date-picker";
import { TablesInsert } from "@/utils/types/supabase";

const CrearCliente: React.FC = () => {
    // Hacemos que todos los campos sean opcionales
    type ClientFormData = Partial<TablesInsert<"clientes">>;

    const [formData, setFormData] = useState<ClientFormData>({});
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value || null }));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        console.log(formData);

        const { error } = await supabase.from("clientes").insert([formData]);

        if (error) {
            console.error("Error al crear cliente:", error);
            alert("Hubo un error al crear el cliente.");
            setLoading(false);
            return;
        }

        alert("Cliente creado exitosamente.");
        setFormData({});
        setLoading(false);
    };

    return (
        <div className="flex justify-center mt-10">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 bg-neutral-50 rounded-lg shadow-md max-w-md w-full"
            >
                <h1 className="text-2xl font-bold mb-4">Crear Cliente</h1>
                <Input
                    name="nombre"
                    placeholder="Nombre *"
                    value={formData.nombre ?? ""}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos ?? ""}
                    onChange={handleChange}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                />
                <Input
                    name="telefono"
                    type="tel"
                    placeholder="Teléfono *"
                    value={formData.telefono ?? ""}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="direccion"
                    placeholder="Dirección *"
                    value={formData.direccion ?? ""}
                    onChange={handleChange}
                    required
                />
                <div className="flex flex-row justify-around mt-3">
                    {/* //TODO: Arreglar Tipo para las fechas con supabase gen types */}
                    <DatePicker
                        label="Fecha de entrada"
                        required={true}
                        date={
                            formData.fecha_entrada
                                ? new Date(formData.fecha_entrada)
                                : undefined
                        }
                        setDate={(date) =>
                            setFormData((prev) => ({
                                ...prev,
                                fecha_entrada: date,
                            }))
                        }
                    />
                    <DatePicker
                        label="Fecha de salida"
                        date={
                            formData.fecha_salida
                                ? new Date(formData.fecha_salida)
                                : undefined
                        }
                        setDate={(date) =>
                            setFormData((prev) => ({
                                ...prev,
                                fecha_salida: date ? date.toISOString() : null,
                            }))
                        }
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear Cliente"}
                </Button>
            </form>
        </div>
    );
};

export default CrearCliente;