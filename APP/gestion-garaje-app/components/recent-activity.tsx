// components/recent-activity.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ActivityItem from "@/components/activity-item";

interface ActivityData {
    time: string;
    action: string;
    details: string;
}

interface RecentActivityProps {
    activities: ActivityData[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                    ))}
                    <Button variant="ghost" className="w-full mt-4">
                        Ver toda la actividad{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
