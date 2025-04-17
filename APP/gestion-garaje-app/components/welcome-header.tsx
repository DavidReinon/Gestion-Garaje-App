import { Separator } from "@/components/ui/separator";

interface WelcomeHeaderProps {
    userName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
                Bienvenido {userName},
            </h1>
            <p className="text-xl text-muted-foreground">
                Gestiona tu Garaje 😊!
            </p>
            <Separator className="my-4" />
            <p className="text-muted-foreground">
                Usa la Barra de Navegación que se encuentra en la parte
                izquierda para navegar por las secciones y poder acceder a todas
                las funcionalidades disponibles.
            </p>
        </div>
    );
};

export default WelcomeHeader;
