// app/page.tsx
import { ParkingCircle, Car, Users } from "lucide-react";
import WelcomeHeader from "@/components/welcome-header";
import RecentActivity from "@/components/recent-activity";
import StatCard from "@/components/stat-card";
import getDashboardStats from "@/services/dashboard.service";

const HomePage: React.FC = async () => {
    const stats = await getDashboardStats();
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
                    value="24/36"
                    change="-2"
                    icon={ParkingCircle}
                />
                <StatCard
                    title="Vehículos totales (activos e inactivos)"
                    value="124"
                    change="+8"
                    icon={Car}
                />
                <StatCard
                    title="Clientes activos"
                    value="32"
                    change="+3"
                    icon={Users}
                />
            </div>

            <RecentActivity activities={activities} />
        </div>
    );
};

export default HomePage;
