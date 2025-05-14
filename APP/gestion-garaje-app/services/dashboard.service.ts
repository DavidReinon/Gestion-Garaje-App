// services/dashboard.service.ts
import { createClient } from "@/utils/supabase/client";

interface Activity {
    time: string;
    action: string;
    details: string;
    timestamp: Date;
}

interface DashboardStats {
    occupiedSpaces: number;
    totalSpaces: number;
    totalCars: number;
    activeClients: number;
    monthlyChange: {
        cars: number;
        clients: number;
    };
    recentActivities: Activity[];
}

const TOTAL_SPACES = 36; // Total de plazas disponibles en el parking
const supabase = createClient();

// Función auxiliar para formatear fechas
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60)
        return `Hace ${diffInSeconds} ${diffInSeconds === 1 ? "segundo" : "segundos"}`;
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} hora ${hours === 1 ? "hora" : "horas"}`;
    }

    const diffInDays = Math.floor(diffInSeconds / 86400);
    return diffInDays === 1 ? "Ayer" : `Hace ${diffInDays} días`;
};

// Función para obtener actividades recientes combinadas
const getRecentActivities = async (): Promise<Activity[]> => {
    // Obtener últimos cambios en clientes
    const { data: clientes, error: clientesError } = await supabase
        .from("clientes")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5);

    if (clientesError) {
        console.error("Error fetching client activities:", clientesError);
        throw new Error("Failed to fetch client activities");
    }

    // Obtener últimos cambios en coches
    const { data: coches, error: cochesError } = await supabase
        .from("coches")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5);

    if (cochesError) {
        console.error("Error fetching car activities:", cochesError);
        throw new Error("Failed to fetch car activities");
    }

    const clientActivities = clientes.map((cliente) => ({
        time: formatTimeAgo(cliente.updated_at),
        action: cliente.fecha_salida
            ? "Cliente dado de baja: "
            : cliente.updated_at !== cliente.created_at
              ? "Cliente actualizado: "
              : "Nuevo cliente creado: ",
        details: `${cliente.nombre} ${cliente.apellidos} - ${cliente.dni}`,
        timestamp: new Date(cliente.updated_at),
    }));

    const carActivities = coches.map((coche) => ({
        time: formatTimeAgo(coche.updated_at),
        action: !coche.numero_plaza
            ? "Vehículo retirado: "
            : coche.updated_at !== coche.created_at
              ? "Vehículo actualizado: "
              : "Nuevo vehículo creado: ",
        details: `${coche.marca} ${coche.modelo} - ${coche.matricula}`,
        timestamp: new Date(coche.updated_at),
    }));

    // Combinar y ordenar actividades
    return [...clientActivities, ...carActivities]
        .filter(
            (activity) =>
                activity.timestamp instanceof Date &&
                !isNaN(activity.timestamp.getTime())
        ) // Validar timestamps válidos
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5); // Mostrar solo las 5 más recientes
};

const getDashboardStats = async (): Promise<DashboardStats> => {
    // Obtener datos básicos en paralelo para mejor rendimiento

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
        { count: occupiedSpaces },
        { count: totalCars },
        { count: activeClients },
        { count: monthlyCars },
        { count: monthlyClients },
        recentActivities,
    ] = await Promise.all([
        supabase
            .from("coches")
            .select("*", { count: "exact", head: true })
            .not("numero_plaza", "is", null),
        supabase.from("coches").select("*", { count: "exact", head: true }),
        supabase
            .from("clientes")
            .select("*", { count: "exact", head: true })
            .or("fecha_salida.is.null,fecha_salida.gt.now()"),
        supabase
            .from("coches")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toUTCString()),
        supabase
            .from("clientes")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toUTCString()),
        getRecentActivities(),
    ]);

    return {
        totalSpaces: TOTAL_SPACES,
        occupiedSpaces: occupiedSpaces || 0,
        totalCars: totalCars || 0,
        activeClients: activeClients || 0,
        monthlyChange: {
            cars: monthlyCars || 0,
            clients: monthlyClients || 0,
        },
        recentActivities,
    };
};

export default getDashboardStats;
export type { DashboardStats };
