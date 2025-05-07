interface ActivityItemProps {
    time: string;
    action: string;
    details: string;
    icon?: React.ReactNode;
  }
  
  const ActivityItem = ({
    time,
    action,
    details,
    icon
  }: ActivityItemProps) => {
    return (
      <div className="flex items-start gap-3">
        {icon || <div className="h-2 w-2 bg-primary rounded-full mt-2" />}
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