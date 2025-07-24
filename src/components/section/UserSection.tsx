import { SearchIcon } from "lucide-react";
import { Pencil, Plus, ShieldCheck } from "lucide-react";
import type User from "../../types/user";

interface Props {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    handleAddUser: () => void;
    handleEditUser: (user: User) => void;
    toggleActiveUser: (id: string, isActive: boolean) => void;
    users: User[];
    currentPageUsers: number;
    setCurrentPageUsers: (page: number) => void;
    totalPagesUsers: number;
}

export default function UserSection({
    searchKeyword,
    setSearchKeyword,
    handleAddUser,
    handleEditUser,
    toggleActiveUser,
    users,
    currentPageUsers,
    setCurrentPageUsers,
    totalPagesUsers
}: Props) {
    return (
        <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl shadow-md">
            <div className="relative w-1/4 mb-3">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari user berdasarkan username atau nama ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none"
                />
            </div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <button
                    onClick={handleAddUser}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={16} /> Tambah User
                </button>
            </div>

            <table className="w-full text-left border">
                <thead>
                    <tr className="bg-green-600">
                        <th className="p-2 border w-[50px] text-center">NO</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Username</th>
                        <th className="p-2 border">Telephone</th>
                        <th className="p-2 border w-[500px]">Akses Aplikasi</th>
                        <th className="p-2 border w-[100px] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={String(user.user_id)}>
                            <td className="p-2 border text-center">
                                {(currentPageUsers - 1) * 8 + index + 1}
                            </td>
                            <td className="p-2 border">{user.name}</td>
                            <td className="p-2 border">{user.username}</td>
                            <td className="p-2 border">{user.telephone}</td>
                            <td className="p-2 border">
                                {user.access_apps?.map((app) => app.name).join(", ") || "-"}
                            </td>
                            <td className="p-2 border text-center">
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="bg-yellow-500 rounded-md px-2 py-1 flex items-center gap-1 shadow hover:bg-yellow-600 transition cursor-pointer"
                                    >
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => toggleActiveUser(user.user_id, user.is_active)}
                                        className={`min-w-[120px] cursor-pointer flex items-center gap-1 justify-center rounded-md px-3 py-1 text-sm text-white transition-colors ${user.is_active
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        <ShieldCheck size={16} />
                                        {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPageUsers(Math.max(currentPageUsers - 1, 1))}
                    disabled={currentPageUsers === 1}
                    className={`px-4 py-1.5 rounded bg-gray-600 text-white disabled:opacity-50 ${currentPageUsers === 1 ? "cursor-default" : "cursor-pointer"
                        }`}
                >
                    Previous
                </button>
                <span className="self-center text-sm">Page {currentPageUsers} of {totalPagesUsers}</span>
                <button
                    onClick={() => setCurrentPageUsers(Math.min(currentPageUsers + 1, totalPagesUsers))}
                    disabled={currentPageUsers === totalPagesUsers}
                    className={`px-4 py-1.5 rounded bg-gray-600 text-white disabled:opacity-50 ${currentPageUsers === totalPagesUsers ? "cursor-default" : "cursor-pointer"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
