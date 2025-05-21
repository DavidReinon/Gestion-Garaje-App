"use client";

import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, ReactNode } from "react";

type GlobalContextType = {
    username: string;
    user: User | null;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalContextProvider = ({
    user,
    children,
}: {
    user: User | null;
    children: ReactNode;
}) => {
    const username = user?.email?.startsWith("t")
        ? "Toni"
        : user?.email?.startsWith("d")
          ? "David"
          : "Invitado";

    return (
        <GlobalContext.Provider value={{ username, user }}>
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
