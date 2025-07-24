import {
    LockKeyholeOpen,
    LogOut,
    // Menu,
    User2,
    // X 
} from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";

interface HeaderProps {
    title: string;
    centerTitle: string;
    // sidebarOpen: boolean;
    // setSidebarOpen: (open: boolean) => void;
    profileDropdownOpen: boolean;
    setProfileDropdownOpen: (open: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    onLogout: () => void;
}

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

export default function Header({
    title,
    centerTitle,
    // sidebarOpen, 
    // setSidebarOpen, 
    profileDropdownOpen,
    setProfileDropdownOpen,
    dropdownRef,
    onLogout }:
    HeaderProps) {
    const { user } = useUser();

    let avatarUrl;
    if (user?.photo) {
        if(user?.photo.includes("http")) {
            avatarUrl = user.photo;
        } else {
            avatarUrl = `${AVATAR_BASE_URL}/${user.photo}`;
        }
    } else {
        avatarUrl = "/assets/avatar/avatar.png";
    }

    return (
        <header className="flex items-center justify-between mb-2">
            {/* Toggle Sidebar */}
            {/* <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 bg-gray-200 cursor-pointer p-2 rounded-md hover:bg-gray-300"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button> */}

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-white mt-[10px]" style={{ textShadow: "4px 4px 4px rgba(0, 0, 0, 1)" }}>{title}</h1>
            <h1 className="text-5xl font-bold text-white mt-[10px] text-center" style={{ textShadow: "-2px -2px 4px rgba(0, 0, 0, 1)" }}>{centerTitle}</h1>

            {/* Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="focus:outline-none cursor-pointer"
                >
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-white hover:border-gray-600 transition object-cover"
                    />
                </button>

                {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                        <Link
                            to="/edit-profil"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <User2 size={18} />
                            Edit Profil
                        </Link>
                        {user?.role_id === "2337aeb1-5afd-430a-a708-9be9085d72e8" && (
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                <LockKeyholeOpen size={18} />
                                Admin
                            </Link>
                        )}
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