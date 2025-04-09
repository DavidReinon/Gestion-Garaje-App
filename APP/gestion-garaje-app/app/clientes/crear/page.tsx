"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input"; // Componente Input de shadcn
import { Button } from "@/components/ui/button"; // Componente Button de shadcn
import { createClient } from "@/utils/supabase/client"; // Supabase client

const CrearCliente: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        fecha_entrada: "",
        fecha_salida: "",
    });
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        //TODO: Datos opcionales a null
        // Si el valor es una cadena vacía, lo convertimos a null
        setFormData((prev) => ({ ...prev, [name]: value || null }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log(formData);
        const { error } = await supabase.from("clientes").insert([formData]);

        if (error) {
            console.error("Error al crear cliente:", error);
            alert("Hubo un error al crear el cliente.");
        } else {
            alert("Cliente creado exitosamente.");
            setFormData({
                nombre: "",
                apellidos: "",
                email: "",
                telefono: "",
                direccion: "",
                fecha_entrada: "",
                fecha_salida: "",
            });
        }

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
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    name="telefono"
                    type="tel"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                />
                <div className="flex flex-row justify-around mt-3">
                    <div>
                        <label htmlFor="fecha_entrada" className="text-sm">
                            Fecha de Entrada
                        </label>
                        <Input
                            name="fecha_entrada"
                            id="fecha_entrada"
                            type="date"
                            placeholder="Fecha de Entrada"
                            value={formData.fecha_entrada}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="fecha_salida" className="text-sm">
                            Fecha de salida (Opcional)
                        </label>
                        <Input
                            name="fecha_salida"
                            id="fecha_salida"
                            type="date"
                            placeholder="Fecha de Salida"
                            value={formData.fecha_salida}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear Cliente"}
                </Button>
            </form>
        </div>
    );
};

export default CrearCliente;
