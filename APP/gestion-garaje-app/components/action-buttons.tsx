"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface ActionButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
    return (
        <div className="flex">
            <Button variant="ghost" size="sm" onClick={onEdit}>
                <PencilIcon className="h-6 w-6 text-blue-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2Icon className="h-6 w-6 text-red-600" />
            </Button>
        </div>
    );
};

export default ActionButtons;
