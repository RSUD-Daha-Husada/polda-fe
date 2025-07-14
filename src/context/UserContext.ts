import { createContext } from "react";
import type User from "../types/user";

interface UserCtx {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}

export const UserContext = createContext<UserCtx | undefined>(undefined);