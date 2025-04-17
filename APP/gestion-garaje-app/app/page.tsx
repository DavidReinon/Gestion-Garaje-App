import {
    ParkingCircle,
    Car,
    Users,
    Activity,
    Settings,
    ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ActivityItem from "../components/activity-item";
import StateCard from "@/components/state-card";

const HomePage: React.FC = () => {
    return (
        <div className="p-6">
            {/* Encabezado de bienvenida */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {/* TODO: Cambiar por el nombre del usuario del contexto global */}
                    Bienvenido {"David"},
                </h1>
                <p className="text-xl text-muted-foreground">
                    Gestiona tu Garaje 😊!
                </p>

                <Separator className="my-4" />

                <p className="text-muted-foreground">
                    Usa la Barra de Navegación que se encuentra en la parte
                    izquierda para navegar por las secciones y poder acceder a
                    todas las funcionalidades disponibles.
                </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                {/* Ocupación */}
                <StateCard
                    title="Plazas Ocupadas"
                    value="24/36"
                    change="-2"
                    icon={<ParkingCircle className="h-6 w-6 text-primary" />}
                />

                {/* Vehículos registrados (totales) */}
                <StateCard
                    title="Vehículos totales"
                    value="124"
                    change="+8 este mes"
                    icon={<Car className="h-6 w-6 text-primary" />}
                />

                {/* Clientes activos */}
                <StateCard
                    title="Clientes activos"
                    value="32"
                    change="+3"
                    icon={<Users className="h-6 w-6 text-primary" />}
                />
            </div>
            {/* Sección de actividad reciente */}
            <Card>
                <CardHeader>
                    <CardTitle>Actividad reciente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <ActivityItem
                            time="Hace 10 min"
                            action="Nuevo vehículo registrado"
                            details="ABC-1234"
                        />
                        <ActivityItem
                            time="Hace 25 min"
                            action="Plaza liberada"
                            details="Sector B - Plaza 12"
                        />
                        <ActivityItem
                            time="Hace 1 hora"
                            action="Pago registrado"
                            details="Cliente #0452"
                        />

                        <Button variant="ghost" className="w-full mt-4">
                            Ver toda la actividad{" "}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomePage;
