import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute() {
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/" replace />
    }

    return <Outlet /> // untuk render route anak di dalamnya
}
