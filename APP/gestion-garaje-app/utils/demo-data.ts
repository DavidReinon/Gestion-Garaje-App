import { Tables } from "./types/supabase";

type Cliente = Tables<"clientes"> & {
    coche?: string;
    matricula?: string;
};

export const clientesDatosPrueba: Cliente[] = [
    {
        apellidos: "García López",
        codigo_postal: "28001",
        direccion: "Calle Mayor, 10",
        dni: "12345678A",
        email: "garcia.lopez@example.com",
        fecha_entrada: "2023-01-15",
        fecha_salida: null,
        id: 1,
        nombre: "Juan",
        numero_cuenta_iban: "ES9121000418450200051332",
        observaciones: null,
        poblacion: "Madrid",
        provincia: "Madrid",
        telefono: "600123456",
    },
    {
        apellidos: "Martínez Pérez",
        codigo_postal: "46001",
        direccion: "Avenida del Puerto, 25",
        dni: "87654321B",
        email: "martinez.perez@example.com",
        fecha_entrada: "2023-02-10",
        fecha_salida: "2023-02-20",
        id: 2,
        nombre: "Ana",
        numero_cuenta_iban: "ES7621000418450200056789",
        observaciones: null,
        poblacion: "Valencia",
        provincia: "Valencia",
        telefono: "650987654",
    },
    {
        apellidos: "Fernández Gómez",
        codigo_postal: "41001",
        direccion: "Plaza Nueva, 3",
        dni: "11223344C",
        email: "fernandez.gomez@example.com",
        fecha_entrada: "2023-03-05",
        fecha_salida: null,
        id: 3,
        nombre: "Luis",
        numero_cuenta_iban: "ES3021000418450200067890",
        observaciones: "Prefiere contacto por email",
        poblacion: "Sevilla",
        provincia: "Sevilla",
        telefono: "620123789",
    },
];
