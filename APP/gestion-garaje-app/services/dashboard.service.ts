// services/dashboard.service.ts
import { createClient } from "@/utils/supabase/client";

interface DashboardStats {
    occupiedSpaces: number;
    totalSpaces: number;
    totalCars: number;
    activeClients: number;
    monthlyChange: {
        cars: number;
        clients: number;
    };
}
const TOTAL_SPACES = 36; // Total de plazas disponibles en el parking
const supabase = createClient();

const getDashboardStats = async (): Promise<DashboardStats> => {
    // 1. Obtener datos actuales
    const { count: occupiedSpaces } = await supabase
        .from("coches")
        .select("*", { count: "exact", head: true })
        .not("numero_plaza", "is", null);

    const { count: totalCars } = await supabase
        .from("coches")
        .select("*", { count: "exact", head: true });

    const { count: activeClients } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .or("fecha_salida.is.null,fecha_salida.gt.now()");

    // 2. Calcular cambios mensuales
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthlyCars } = await supabase
        .from("coches")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

    const { count: monthlyClients } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

    return {
        totalSpaces: TOTAL_SPACES,
        occupiedSpaces: occupiedSpaces || 0,
        totalCars: totalCars || 0,
        activeClients: activeClients || 0,
        monthlyChange: {
            cars: monthlyCars || 0,
            clients: monthlyClients || 0,
        },
    };
};

export default getDashboardStats;
