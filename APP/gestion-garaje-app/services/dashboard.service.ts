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
// //Ejemplo mas completo de dashboard.service.ts
// interface DashboardStats {
//     occupiedSpaces: number;
//     totalSpaces: number;
//     totalCars: number;
//     activeClients: number;
//     monthlyChange: {
//       cars: number;
//       clients: number;
//     };
//     recentActivities: {
//       time: string;
//       action: string;
//       details: string;
//     }[];
//   }
  
//   const getDashboardStats = async (): Promise<DashboardStats> => {
//     // Consultas básicas
//     const [
//       { count: occupiedSpaces },
//       { count: totalCars },
//       { count: activeClients },
//       { data: recentClients },
//       { data: recentCars }
//     ] = await Promise.all([
//       supabase
//         .from('coches')
//         .select('*', { count: 'exact', head: true })
//         .not('numero_plaza', 'is', null),
//       supabase
//         .from('coches')
//         .select('*', { count: 'exact', head: true }),
//       supabase
//         .from('clientes')
//         .select('*', { count: 'exact', head: true })
//         .or('fecha_salida.is.null,fecha_salida.gt.now()'),
//       supabase
//         .from('clientes')
//         .select('id, nombre, apellidos, fecha_salida, updated_at')
//         .order('updated_at', { ascending: false })
//         .limit(3),
//       supabase
//         .from('coches')
//         .select('id, matricula, cliente_id, numero_plaza, created_at, updated_at')
//         .order('updated_at', { ascending: false })
//         .limit(3)
//     ]);
  
//     // Procesar actividades recientes
//     const recentActivities = [
//       ...(recentClients?.map(cliente => ({
//         time: formatTimeAgo(cliente.updated_at),
//         action: cliente.fecha_salida ? 'Baja de cliente' : cliente.updated_at === cliente.created_at ? 'Nuevo cliente' : 'Actualización',
//         details: `${cliente.nombre} ${cliente.apellidos}`,
//       })) || []),
//       ...(recentCars?.map(coche => ({
//         time: formatTimeAgo(coche.updated_at),
//         action: coche.numero_plaza ? 'Asignación de plaza' : 'Liberación de plaza',
//         details: `Matrícula: ${coche.matricula}`,
//       })) || [])
//     ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//      .slice(0, 5);
  
//     return {
//       occupiedSpaces: occupiedSpaces || 0,
//       totalSpaces: 36, // Valor configurable
//       totalCars: totalCars || 0,
//       activeClients: activeClients || 0,
//       monthlyChange: await getMonthlyChanges(),
//       recentActivities
//     };
//   };
  
//   // Función auxiliar
//   const formatTimeAgo = (dateString: string) => {
//     // Implementación de la función que convierte fechas a "Hace X tiempo"
//     // ...
//   };

export default getDashboardStats;
