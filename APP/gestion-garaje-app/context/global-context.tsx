"use client";

import { userMap } from "@/utils/users-mapper";
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
    const username = user?.email
        ? userMap[user.email] || user.email.split("@")[0] || "Invitado"
        : "Invitado";

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
