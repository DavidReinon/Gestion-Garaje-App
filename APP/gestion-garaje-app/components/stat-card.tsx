import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    description?: string;
}

const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => {
    const isPositive = change ? change > 0 : false;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 ms-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p
                        className={`text-xs ${isPositive ? "text-green-500" : "text-gray-500"}`}
                    >
                        {isPositive ? "+" : ""}
                        {change + " este mes"}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
