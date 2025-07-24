import React from "react";
import type { ApplicationForm } from "../../types/ApplicationForm";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: ApplicationForm;
    setForm: (form: ApplicationForm) => void;
    iconPreview: string | null;
    setIconPreview: (url: string | null) => void;
}

const EditAppModal: React.FC<Props> = ({
    show,
    onClose,
    onSubmit,
    form,
    setForm,
    iconPreview,
    setIconPreview,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded-lg shadow p-6 space-y-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    {/* Upload Icon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubah Icon</label>
                        <div className="flex justify-center items-center h-32 w-32 border rounded mb-4 bg-gray-100">
                            {iconPreview ? (
                                <img
                                    src={iconPreview}
                                    alt="Icon Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <span className="text-xs text-gray-400">Belum ada icon</span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("Ukuran file maksimal 2MB");
                                        return;
                                    }

                                    setForm({ ...form, icon: file });
                                    setIconPreview(URL.createObjectURL(file));
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

                    {/* Nama dan Redirect URI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Nama Aplikasi"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="https://..."
                                value={form.redirect_uri}
                                onChange={(e) => setForm({ ...form, redirect_uri: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAppModal;