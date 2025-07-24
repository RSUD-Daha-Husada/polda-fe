import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function IsActiveCheckRoute() {
    const { user } = useUser();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    <Navigate to="/" replace />

    useEffect(() => {
        if (user && user.is_active === false) {
            Swal.fire({
                icon: "error",
                title: "Akun Nonaktif",
                text: "Akun Anda telah dinonaktifkan. Silakan hubungi admin.",
                timer: 3000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                setShouldRedirect(true);
            }, 3000);
        }
    }, [user]);

    if (!user) return null;
    if (shouldRedirect) return <Navigate to="/" replace />;
    if (user.is_active === false) return null; // tahan render sampai redirect

    return <Outlet />;
}
