"use client";

// app/page.tsx
import { ParkingCircle, Car, Users } from "lucide-react";
import WelcomeHeader from "@/components/welcome-header";
import RecentActivity from "@/components/recent-activity";
import StatCard from "@/components/stat-card";
import getDashboardStats, {
    DashboardStats
} from "@/services/dashboard.service";
import { useState } from "react";
import { useMount } from "react-use";

const HomePage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const {
        totalCars: totalVehicles,
        activeClients,
        occupiedSpaces,
        totalSpaces,
        monthlyChange,
        recentActivities = [],
    } = stats || {};

    useMount(() => {
        const savedStats = localStorage.getItem("dashboardStats");
        const parsedSavedStats = savedStats ? JSON.parse(savedStats) : null;

        const fetchStats = async () => {
            const data = await getDashboardStats();
            if (!data) {
                console.error("Error fetching dashboard stats");
                return;
            }

            if (JSON.stringify(parsedSavedStats) !== JSON.stringify(data)) {
                setStats(data);
                console.log("Datos actualizados:", data);
                localStorage.setItem("dashboardStats", JSON.stringify(data));
            } else {
                console.log("Los datos no han cambiado.");
            }
        };

        if (parsedSavedStats) {
            setStats(parsedSavedStats);
        }

        fetchStats();
    });

    console.log(stats);
    const activities = [
        {
            time: "Hace 10 min",
            action: "Nuevo vehículo registrado",
            details: "ABC-1234",
        },
        {
            time: "Hace 25 min",
            action: "Plaza liberada",
            details: "Sector B - Plaza 12",
        },
        {
            time: "Hace 1 hora",
            action: "Pago registrado",
            details: "Cliente #0452",
        },
    ];

    return (
        <div className="p-6">
            <WelcomeHeader userName="David" />

            {/* Estadísticas rápidas */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <StatCard
                    title="Plazas Ocupadas"
                    value={
                        occupiedSpaces
                            ? `${occupiedSpaces}/${totalSpaces}`
                            : "Cargando..."
                    }
                    icon={ParkingCircle}
                />
                <StatCard
                    title="Vehículos totales registrados"
                    value={totalVehicles || "Cargando..."}
                    change={monthlyChange?.cars}
                    icon={Car}
                />
                <StatCard
                    title="Clientes activos"
                    value={activeClients || "Cargando..."}
                    change={monthlyChange?.clients}
                    icon={Users}
                />
            </div>

            <RecentActivity activities={recentActivities} />
        </div>
    );
};

export default HomePage;
