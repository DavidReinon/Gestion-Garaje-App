"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type DatePickerProps = {
    date?: Date;
    setDate: (date: Date | undefined) => void;
    required?: boolean;
};

const DatePicker: React.FC<DatePickerProps> = ({
    date,
    setDate,
    required,
}) => {
    const [touched, setTouched] = useState(false);

    const handleBlur = (): void => {
        setTouched(true);
    };

    return (
        <div className="flex flex-col">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            touched && required && !date && "border-red-500"
                        )}
                        
                        onBlur={handleBlur}
                    >
                        <CalendarIcon />
                        {date ? (
                            format(date, "PPP")
                        ) : (
                            <span>Seleccionar fecha</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePicker;
