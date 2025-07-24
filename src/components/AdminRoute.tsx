import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function AdminRoute() {
    const { user } = useUser();

    // Jika user belum dimuat
    if (!user) return null; // atau spinner

    // Cek role_id
    if (user.role_id !== "2337aeb1-5afd-430a-a708-9be9085d72e8") {
        return <Navigate to="/apps" replace />;
    }

    return <Outlet />;
}
