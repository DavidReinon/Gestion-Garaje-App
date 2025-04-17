import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StateCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

const StateCard: React.FC<StateCardProps> = ({
    title,
    value,
    change,
    icon,
}) => {
    const isPositive = change.startsWith("+");

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p
                    className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
                >
                    {change} respecto el ulitmo mes
                </p>
            </CardContent>
        </Card>
    );
};

export default StateCard;
