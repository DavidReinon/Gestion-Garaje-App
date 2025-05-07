import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    icon: LucideIcon;
    description?: string;
}

const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
}: StatCardProps) => {
    const isPositive = !change.startsWith("-");

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p
                    className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
                >
                    {`${change} respecto al mes pasado`}
                </p>
            </CardContent>
        </Card>
    );
};

export default StatCard;
