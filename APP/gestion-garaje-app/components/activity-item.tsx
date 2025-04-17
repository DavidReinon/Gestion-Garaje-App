interface ActivityItemProps {
    time: string;
    action: string;
    details: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
    time,
    action,
    details,
}) => {
    return (
        <div className="flex items-start">
            <div className="h-2 w-2 bg-primary rounded-full mt-2 mr-3"></div>
            <div>
                <p className="text-sm font-medium leading-none">
                    {action} <span className="font-semibold">{details}</span>
                </p>
                <p className="text-sm text-muted-foreground">{time}</p>
            </div>
        </div>
    );
};
export default ActivityItem;
