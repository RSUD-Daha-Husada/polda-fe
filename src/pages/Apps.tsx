import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import axiosInstance from "../utils/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import type { UserApplication } from "../types/user_application";
import type Application from "../types/app";

export default function AppsPage() {
    const [apps, setApps] = useState<UserApplication[]>([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosInstance.get("/user-apps/me")
            .then((response) => {
                setApps(response.data);
            });
    }, []);

    function redirectToApp(app: Application) {
        if (loading) return;
        setLoading(true);

        const currentUsername = user?.username || "admin";
        const lastUserMap: Record<string, string> =
            JSON.parse(localStorage.getItem("lastUserMap") || "{}");

        const lastUser = lastUserMap[app.application_id];

        const loginWithForm = () => {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = app.redirect_uri;
            form.style.display = "none";

            [
                ["username", currentUsername],
                ["password", user?.app || "gagal"],
                ["login", "1"],
            ].forEach(([k, v]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = k;
                input.value = v as string;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
            setLoading(false);
        };

        const logoutAndThen = () => {
            const logoutUrl = `${app.logout_url}`;
            const iframe = document.createElement("iframe");
            iframe.src = logoutUrl;
            iframe.style.display = "none";
            document.body.appendChild(iframe);

            setTimeout(() => {
                document.body.removeChild(iframe);
                loginWithForm();
            }, 1000);
        };

        if (lastUser && lastUser !== currentUsername) {
            logoutAndThen();
        } else {
            loginWithForm();
        }

        lastUserMap[app.application_id] = currentUsername;
        localStorage.setItem("lastUserMap", JSON.stringify(lastUserMap));
    }

    return (
        <DashboardLayout title=" " centerTitle="PORTAL DAHA">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]">
                {apps
                    .filter((userApp) => userApp.Application.is_active) // hanya tampilkan app yang aktif
                    .map((userApp) => (
                        <div
                            key={userApp.user_application_id}
                            onClick={() => {
                                if (userApp.Application.name === "mLITE-eresep") {
                                    redirectToApp(userApp.Application);
                                } else {
                                    window.location.href = userApp.Application.redirect_uri;
                                }
                            }}
                            className="cursor-pointer w-full flex flex-col items-center justify-center text-center p-6 bg-gray-200 hover:bg-gray-300 backdrop-blur-md rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg hover:scale-[1.02]"
                        >
                            {userApp.Application.icon && (
                                <img
                                    src={userApp.Application.icon}
                                    alt={`${userApp.Application.name} icon`}
                                    className="h-28 w-28 mb-[40px]" 
                                    style={{ filter: "drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.5))" }}
                                />
                            )}
                            <h3
                                className="text-xl font-semibold text-black drop-shadow-md"
                                style={{ textShadow: "2px 2px 6px rgba(255, 255, 255, 0.5)" }}
                            >
                                {userApp.Application.name}
                            </h3>
                        </div>
                    ))}
            </section>
        </DashboardLayout>
    );
}
