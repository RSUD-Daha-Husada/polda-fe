// src/context/UserContext.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { UserContext } from "./UserContext";
import type User from "../types/user";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); // atau cookie sesuai implementasi kamu
        if (!token) {
            setIsLoading(false);
            return;
        }

        axiosInstance.get("/user/me")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
