import { Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import axiosInstance from "../utils/axios"

export default function PrivateRoute() {
    const [isValid, setIsValid] = useState<boolean | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setIsValid(false)
            return
        }

        axiosInstance.post("/auth/check-token", null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => setIsValid(true))
            .catch(() => setIsValid(false))
    }, [])

    const token = localStorage.getItem("token")
    if (!token) return <Navigate to="/" replace />
    if (isValid === false) return <Navigate to="/" replace />

    return <Outlet />
}
