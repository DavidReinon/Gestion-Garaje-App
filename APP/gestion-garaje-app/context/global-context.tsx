"use client";

import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, ReactNode } from "react";

type GlobalContextType = {
    username: string;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalContextProvider = ({
    user,
    children,
}: {
    user: User | null;
    children: ReactNode;
}) => {
    console.log("Global Context Provider");
    console.log(user);
    const [username] = user?.user_metadata?.full_name || "";

    return (
        <GlobalContext.Provider value={{ username }}>
            {children}
        </GlobalContext.Provider>
    );
};

const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error(
            "useGlobalContext must be used within a GlobalContextProvider"
        );
    }
    return context;
};

export { GlobalContextProvider, useGlobalContext };
