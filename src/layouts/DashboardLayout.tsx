import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
// import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import axiosInstance from "../utils/axios";

interface DashboardLayoutProps {
    title: string;
    centerTitle: string;
    children: ReactNode;
}

const handleLogout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
};

export default function DashboardLayout({ title, centerTitle, children }: DashboardLayoutProps) {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* <Sidebar sidebarOpen={sidebarOpen} /> */}

            <main className="flex-1 p-6">
                <Header
                    title={title}
                    centerTitle={centerTitle}
                    // sidebarOpen={sidebarOpen}
                    // setSidebarOpen={setSidebarOpen}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    dropdownRef={dropdownRef}
                    onLogout={handleLogout}
                />
                {children}
            </main>
        </div>
    );
}
