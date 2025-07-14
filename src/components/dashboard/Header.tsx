import { LogOut, Menu, User2, X } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";

interface HeaderProps {
    title: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    profileDropdownOpen: boolean;
    setProfileDropdownOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    onLogout: () => void;
}

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

export default function Header({ title, sidebarOpen, setSidebarOpen, profileDropdownOpen, setProfileDropdownOpen, dropdownRef, onLogout }: HeaderProps) {
    const { user, isLoading } = useUser();
    const avatarUrl = user?.poto
        ? `${AVATAR_BASE_URL}/${user.poto}`
        : "/assets/img/avatar-default.jpeg";

        console.log("Avatar URL:", avatarUrl);
        

    return (
        <header className="flex items-center justify-between mb-6">
            {/* Toggle Sidebar */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 bg-gray-200 cursor-pointer p-2 rounded-md hover:bg-gray-300"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

            {/* Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="focus:outline-none cursor-pointer"
                >
                    <img
                        src={isLoading ? "/assets/img/avatar-default.jpeg" : avatarUrl}
                        alt="Profile"
                        className="w-14 h-14 rounded-full border-2 hover:border-green-600 transition object-cover"
                    />
                </button>

                {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                        <Link
                            to="/edit-profil"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <User2 size={18} />
                            Edit Profil
                        </Link>
                        <button
                            onClick={onLogout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}