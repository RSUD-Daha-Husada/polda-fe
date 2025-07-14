import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../utils/axios";
import type User from "../types/user"; // pastikan file ini berisi interface User seperti yang kamu kirim
import Swal from "sweetalert2";

export default function EditProfilPage() {
    const [user, setUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

    // Fetch user data
    useEffect(() => {
        axiosInstance.get("/user/me")
            .then((res) => {
                const userData: User = res.data;
                setUser(userData);

                setAvatarPreview(userData.poto);
                console.log("profile data:", userData.poto);

            })
            .catch((err) => {
                console.error("Gagal mengambil data profil:", err);
            });
    }, []);

    // Avatar preview
    useEffect(() => {
        if (avatar) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(avatar);
        }
    }, [avatar]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Cek kalau tidak ada perubahan
        const noAvatarChange = !avatar;
        const noPasswordChange = !newPassword;

        if (noAvatarChange && noPasswordChange) {
            Swal.fire({
                icon: "warning",
                title: "Tidak Ada Perubahan",
                text: "Kamu belum mengubah apa pun.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Konfirmasi Tidak Cocok",
                text: "Password baru dan konfirmasi tidak sama.",
            });
            return;
        }

        const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword);
        if (newPassword && !isStrong) {
            Swal.fire({
                icon: "warning",
                title: "Password Lemah",
                text: "Password harus minimal 8 karakter dan mengandung huruf besar, kecil, dan angka.",
            });
            return;
        }

        if (newPassword && !oldPassword) {
            Swal.fire({
                icon: "warning",
                title: "Password Lama Diperlukan",
                text: "Harap isi password lama untuk mengganti password.",
            });
            return;
        }

        const formData = new FormData();
        if (avatar) formData.append("avatar", avatar);
        if (newPassword) {
            formData.append("password", newPassword);
            formData.append("old_password", oldPassword);
        }

        axiosInstance
            .put("/user/edit-profile", formData)
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Profil Berhasil Diperbarui!",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.reload();
                });

                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setChangePassword(false);
            })
            .catch((err) => {
                console.error("Gagal update profil:", err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: err.response?.data?.error || "Gagal memperbarui profil.",
                });
            });
    };

    return (
        <DashboardLayout title="Edit Profil">
            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto bg-white p-6 rounded-xl shadow-md space-y-6"
            >
                {/* Avatar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
                    <div className="relative w-40 h-56 rounded-md overflow-hidden border-3 border-gray-300 shadow">
                        <img
                            src={
                                avatar
                                    ? avatarPreview // base64 dari FileReader
                                    : avatarPreview
                                        ? `${AVATAR_BASE_URL}/${avatarPreview}` // dari server
                                        : "/assets/img/avatar-default.png"
                            }
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />

                    </div>
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={() => document.getElementById("avatarInput")?.click()}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 cursor-pointer"
                        >
                            Upload Foto Baru
                        </button>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                                const maxSize = 2 * 1024 * 1024;

                                if (!validTypes.includes(file.type)) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Format Tidak Didukung",
                                        text: "Hanya diperbolehkan file dengan format JPG, JPEG, atau PNG.",
                                    });
                                    e.target.value = "";
                                    return;
                                }

                                if (file.size > maxSize) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "Ukuran Terlalu Besar",
                                        text: "Ukuran foto maksimal 1MB.",
                                    });
                                    e.target.value = "";
                                    return;
                                }

                                setAvatar(file);
                            }}
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={user?.username || ""}
                            readOnly
                            className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={user?.email || ""}
                            readOnly
                            className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    <input
                        type="text"
                        id="telephone"
                        value={user?.telephone || ""}
                        readOnly
                        className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setChangePassword((prev) => !prev)}
                        className="text-green-700 font-medium cursor-pointer hover:text-green-800"
                    >
                        {changePassword ? "Batal Ubah Password" : "Ubah Password"}
                    </button>
                </div>


                {changePassword && (
                    <>
                        {/* Password lama */}
                        <div>
                            <label htmlFor="passwordLama" className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    id="passwordLama"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full p-2 border rounded-md text-gray-600"
                                    placeholder="Masukkan password lama"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Baris 2 kolom: Password Baru & Konfirmasi Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password Baru */}
                            <div>
                                <label htmlFor="passwordBaru" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                <div className="relative">
                                    <input
                                        id="passwordBaru"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2 border rounded-md text-gray-600 pr-10"
                                        placeholder="Masukkan password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-2 border rounded-md text-gray-600 pr-10"
                                        placeholder="Ulangi password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </>
                )}


                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 cursor-pointer"
                >
                    Simpan Perubahan
                </button>
            </form>
        </DashboardLayout>
    );
}
