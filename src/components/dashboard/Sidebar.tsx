import { AppWindow, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
    sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
    return (
        <aside
            className={`bg-gray-700 text-white transition-all duration-300 ${sidebarOpen ? "w-70" : "w-0 overflow-hidden"
                }`}
        >
            <div className={`${sidebarOpen ? "px-6 py-8" : "hidden"}`}>
                {/* Gambar tengah */}
                <div className="flex justify-center">
                    <img src="/assets/logo/logo-dh.png" alt="" className="w-32 mb-5" />
                </div>
                <h2 className="text-2xl font-bold text-center">Single Sign On</h2>
                <h2 className="text-2xl font-bold mb-8 text-center">RSUD Daha Husada</h2>
                <nav className="flex flex-col gap-4 text-white">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 hover:bg-green-600 px-3 py-2 rounded"
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        to="/apps"
                        className="flex items-center gap-2 hover:bg-green-600 px-3 py-2 rounded"
                    >
                        <AppWindow size={20} />
                        Aplikasi
                    </Link>
                </nav>
            </div>
        </aside>
    );
}  