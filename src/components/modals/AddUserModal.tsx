// components/AddUserModal.tsx
import React from "react";
import type { Role } from "../../types/role";
import type { UserForm } from "../../types/userForm";
import type Application from "../../types/app";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    roles: Role[];
    applications: Application[];
    form: UserForm;
    setForm: (form: UserForm) => void;
    photoPreview: string | null;
    setPhotoPreview: (url: string | null) => void;
}

const AddUserModal: React.FC<Props> = ({
    show,
    onClose,
    onSubmit,
    roles,
    applications,
    form,
    setForm,
    photoPreview,
    setPhotoPreview,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow p-6 space-y-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-6"
                >
                    {/* Upload + Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {/* Label */}
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>

                            {/* Preview (selalu render div, tapi isi gambar jika ada preview) */}
                            <div className="flex justify-center items-center h-32 w-32 border rounded mb-4">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">Belum ada foto</span>
                                )}
                            </div>

                            {/* Input File */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setForm({ ...form, photo: file });
                                        setPhotoPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Password"
                                type="text"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Telephone"
                                value={form.telephone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setForm({ ...form, telephone: value });
                                    }
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                                <option value="">Pilih Gender</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={form.role_id}
                                onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                                required
                            >
                                <option value="">Pilih Role</option>
                                {roles.map((role) => (
                                    <option key={role.role_id} value={role.role_id}>{role.name == "admin" ? "Admin" : "User"}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aplikasi yang Diakses</label>
                        {/* Container untuk "Pilih Semua" di kanan */}
                        <div className="flex justify-end mb-3">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                                    checked={form.application_ids.length === applications.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const allIds = applications.map((app) => String(app.application_id));
                                            setForm({ ...form, application_ids: allIds });
                                        } else {
                                            setForm({ ...form, application_ids: [] });
                                        }
                                    }}
                                />
                                <span className="ml-2 text-sm text-gray-700">Pilih Semua</span>
                            </label>
                        </div>

                        {/* Grid Aplikasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                            {applications.map((app) => (
                                <div
                                    key={app.application_id}
                                    className="flex items-center gap-2 p-2 bg-gray-100 rounded shadow-sm"
                                >
                                    <input
                                        id={`app-${app.application_id}`}
                                        type="checkbox"
                                        value={String(app.application_id)}
                                        checked={form.application_ids.includes(String(app.application_id))}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const value = String(e.target.value);
                                            let updated = [...form.application_ids];
                                            if (checked) {
                                                if (!updated.includes(value)) {
                                                    updated.push(value);
                                                }
                                            } else {
                                                updated = updated.filter((id) => id !== value);
                                            }
                                            setForm({ ...form, application_ids: updated });
                                        }}
                                        className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer"
                                    />
                                    <label htmlFor={`app-${app.application_id}`} className="text-sm text-gray-700">
                                        {app.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                            Tambah
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
