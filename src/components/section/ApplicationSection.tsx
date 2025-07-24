import { Pencil, Plus, SearchIcon, ShieldCheck } from "lucide-react";
import type Application from "../../types/app";

interface Props {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    handleAddApp: () => void;
    handleEditApp: (app: Application) => void;
    toggleActiveApp: (id: string, isActive: boolean) => void;
    appForTable: Application[];
    currentPageApps: number;
    setCurrentPageApps: (page: number) => void;
    totalPagesApps: number;
}

export default function ApplicationSection({
    searchKeyword,
    setSearchKeyword,
    handleAddApp,
    handleEditApp,
    toggleActiveApp,
    appForTable,
    currentPageApps,
    setCurrentPageApps,
    totalPagesApps,
}: Props) {
    return (
        <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl shadow-md">
            <div className="relative w-1/4 mb-3">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari user berdasarkan nama ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none"
                />
            </div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Aplikasi</h2>
                <button
                    onClick={handleAddApp}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={16} /> Tambah Aplikasi
                </button>
            </div>

            <table className="w-full text-left border">
                <thead>
                    <tr className="bg-green-600">
                        <th className="p-2 border w-[50px] text-center">NO</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">URL</th>
                        <th className="p-2 border w-[120px] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {appForTable.map((app, index) => (
                        <tr key={app.application_id}>
                            <td className="p-2 border text-center">
                                {(currentPageApps - 1) * 8 + index + 1}
                            </td>
                            <td className="p-2 border">{app.name}</td>
                            <td className="p-2 border">{app.redirect_uri}</td>
                            <td className="p-2 border text-center">
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleEditApp(app)}
                                        className="bg-yellow-500 rounded-md px-2 py-1 flex items-center gap-1 shadow hover:bg-yellow-600 transition cursor-pointer"
                                    >
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => toggleActiveApp(app.application_id, app.is_active)}
                                        className={`min-w-[120px] flex items-center gap-1 justify-center rounded-md px-3 py-1 text-sm text-white transition-colors ${app.is_active
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-red-500 hover:bg-red-600"
                                            }`}
                                    >
                                        <ShieldCheck size={16} />
                                        {app.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPageApps(Math.max(currentPageApps - 1, 1))}
                    disabled={currentPageApps === 1}
                    className={`px-4 py-1.5 rounded bg-gray-600 text-white disabled:opacity-50 ${currentPageApps === 1 ? "cursor-default" : "cursor-pointer"
                        }`}
                >
                    Previous
                </button>
                <span className="self-center text-sm">Page {currentPageApps} of {totalPagesApps}</span>
                <button
                    onClick={() => setCurrentPageApps(Math.min(currentPageApps + 1, totalPagesApps))}
                    disabled={currentPageApps === totalPagesApps}
                    className={`px-4 py-1.5 rounded bg-gray-600 text-white disabled:opacity-50 ${currentPageApps === totalPagesApps ? "cursor-default" : "cursor-pointer"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
