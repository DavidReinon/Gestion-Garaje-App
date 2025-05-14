import React from "react";

interface LoadingSpinProps {
    heightContainer?: number | string;
}

const  LoadingSpin: React.FC<LoadingSpinProps> = ({ heightContainer = 20 }) => {
    return (
        <div className={`flex justify-center items-center h-${heightContainer}`}>
            <div className="animate-spin rounded-full h-10 w-10 border-t-0 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default LoadingSpin;
