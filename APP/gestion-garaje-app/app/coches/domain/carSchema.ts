import { z } from "zod";

enum CarType {
    Hibrido = "Hibrido",
    Electrico = "Electrico",
    Estandar = "Estandar",
}
// Definición del esquema de validación con Zod
const carSchema = z.object({
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
        .optional(), // Convierte automáticamente a número y valida el rango
    color: z.string().optional(),
    tipo: z.enum(Object.values(CarType) as [CarType, ...CarType[]]).optional(),
    numero_plaza: z.coerce
        .number()
        .min(1, "El número de plaza debe ser mayor a 0")
        .or(z.literal(""))
        .optional(),
    cliente_id: z.coerce.number().min(1, "El cliente es obligatorio"),
});

const defaultValues = {
    marca: "",
    modelo: "",
    matricula: "",
    año: undefined,
    color: "",
    tipo: CarType.Estandar,
    numero_plaza: undefined,
    cliente_id: 0,
};

const spainMatriculaRegex = /^[0-9]{4}\s?[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

type CarFormDataType = z.infer<typeof carSchema>;

export { carSchema, defaultValues, spainMatriculaRegex, CarType };
export type { CarFormDataType };
