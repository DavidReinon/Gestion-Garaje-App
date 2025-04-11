"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import DatePicker from "@/components/date-picker";

type ClientFormData = {
    nombre?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    fecha_entrada?: Date;
    fecha_salida?: Date;
};

const CrearCliente: React.FC = () => {
    const [formData, setFormData] = useState<ClientFormData>({});
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        console.log(value === "" ? `${name} VACIO` : value);
        setFormData((prev) => ({ ...prev!, [name]: !value ? null : value }));
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        console.log(formData);
        // const { error } = await supabase.from("clientes").insert([formData]);

        // if (error) {
        //     console.error("Error al crear cliente:", error);
        //     alert("Hubo un error al crear el cliente.");
        //     return;
        // }

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
                    <DatePicker
                        label="Fecha de entrada"
                        required={true}
                        date={formData.fecha_entrada}
                        setDate={(date) =>
                            setFormData((prev) => ({
                                ...prev,
                                fecha_entrada: date,
                            }))
                        }
                    />
                    <DatePicker
                        label="Fecha de salida"
                        date={formData.fecha_salida}
                        setDate={(date) =>
                            setFormData((prev) => ({
                                ...prev,
                                fecha_salida: date,
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
