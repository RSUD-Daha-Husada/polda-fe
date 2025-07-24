import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import type { Role } from "../types/role";
import AddUserModal from "../components/modals/AddUserModal";
import type { UserForm } from "../types/userForm";
import type User from "../types/user";
import type Application from "../types/app";
import AddAppModal from "../components/modals/AddAppModal";
import type { ApplicationForm } from "../types/ApplicationForm";
import EditUserModal from "../components/modals/EditUserModal";
import EditAppModal from "../components/modals/EditAppModal";
import UserSection from "../components/section/UserSection";
import ApplicationSection from "../components/section/ApplicationSection";
import TabSwitcher from "../components/common/TabSwitcher";

const initialUserForm: UserForm = {
    user_id: "",
    name: "",
    email: "",
    username: "",
    password: "",
    telephone: "",
    gender: "",
    role_id: "",
    photo: "",
    application_ids: [] as string[],
};

const initialAppForm: ApplicationForm = {
    application_id: "",
    name: "",
    redirect_uri: "",
    icon: "",
};

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [apps, setApps] = useState<Application[]>([]);
    const [appForTable, setAppForTable] = useState<Application[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [addUserForm, setAddUserForm] = useState(initialUserForm);
    const [editUserForm, setEditUserForm] = useState(initialUserForm);
    const [addAppForm, setAddAppForm] = useState(initialAppForm);
    const [editAppForm, setEditAppForm] = useState(initialAppForm);

    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showAddAppForm, setShowAddAppForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    const [showEditAppForm, setShowEditAppForm] = useState(false);

    const [activeTab, setActiveTab] = useState<"users" | "apps">("users");

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    const [currentPageUsers, setCurrentPageUsers] = useState(1);
    const [totalPagesUsers, setTotalPagesUsers] = useState(1);

    const [currentPageApps, setCurrentPageApps] = useState(1);
    const [totalPagesApps, setTotalPagesApps] = useState(1);

    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        let handler: NodeJS.Timeout;

        const fetchData = async (pageUsers: number, pageApps: number, keyword: string) => {
            try {
                const [usersRes, appsRes, appsResTable, rolesRes] = await Promise.all([
                    axiosInstance.get(`/user/get-all?page=${pageUsers}&limit=8&search=${keyword}`),
                    axiosInstance.get("/apps"),
                    axiosInstance.get(`/apps/get-all?page=${pageApps}&limit=8&search=${keyword}`),
                    axiosInstance.get("/roles"),
                ]);

                const userData = usersRes.data;
                const appForTableData = appsResTable.data;

                setUsers(userData.data);
                setTotalPagesUsers(Math.ceil(userData.total / userData.limit));
                setApps(appsRes.data);
                setAppForTable(appForTableData.data);
                setTotalPagesApps(Math.ceil(appForTableData.total / appForTableData.limit));
                setRoles(rolesRes.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                Swal.fire("Gagal memuat data", "", "error");
            }
        };

        if (searchKeyword !== "") {
            handler = setTimeout(() => {
                setCurrentPageUsers(1);
                setCurrentPageApps(1);
                fetchData(1, 1, searchKeyword);
            }, 500);
        } else {
            fetchData(currentPageUsers, currentPageApps, searchKeyword);
        }

        return () => clearTimeout(handler);
    }, [searchKeyword, currentPageUsers, currentPageApps]);

    const createUser = async () => {
        try {
            if (addUserForm.application_ids.length < 1) {
                Swal.fire("Pilih minimal satu aplikasi", "", "warning");
                return;
            }
            const formData = new FormData();
            formData.append("name", addUserForm.name);
            formData.append("email", addUserForm.email);
            formData.append("username", addUserForm.username);
            formData.append("password", addUserForm.password);
            formData.append("telephone", addUserForm.telephone);
            formData.append("gender", addUserForm.gender);
            formData.append("role_id", addUserForm.role_id);
            formData.append("photo", addUserForm.photo);

            addUserForm.application_ids.forEach((access: string) => {
                formData.append("application_ids", access);
            });

            // console.log("Data yang dikirim ke backend:");
            // for (let pair of formData.entries()) {
            //     console.log(`${pair[0]}: ${pair[1]}`);
            // }

            await axiosInstance.post("/user/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Berhasil menambahkan user", "", "success");
            setShowAddUserForm(false);
            setAddUserForm(initialUserForm);
            setPhotoPreview(null);

            const usersRes = await axiosInstance.get("/user/get-all");
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error("Gagal Menambahkan User:", error);
            Swal.fire("Gagal menambahkan user", "", "error");
        }
    };

    const createApp = async () => {
        try {
            const formData = new FormData();
            formData.append("name", addAppForm.name);
            formData.append("redirect_uri", addAppForm.redirect_uri);
            formData.append("icon", addAppForm.icon);

            await axiosInstance.post("/apps/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Berhasil menambahkan aplikasi", "", "success");
            setShowAddAppForm(false);
            setAddAppForm(initialAppForm);

            const appForTableRes = await axiosInstance.get("/apps/get-all");
            setAppForTable(appForTableRes.data.data);
        } catch (error) {
            console.error("Gagal Menambahkan Aplikasi:", error);
            Swal.fire("Gagal menambahkan aplikasi", "", "error");
        }
    }

    const updateUser = async () => {
        try {
            if (editUserForm.application_ids.length < 1) {
                Swal.fire("Pilih minimal satu aplikasi", "", "warning");
                return;
            }
            const formData = new FormData();
            formData.append("name", editUserForm.name);
            formData.append("email", editUserForm.email);
            formData.append("username", editUserForm.username);
            formData.append("telephone", editUserForm.telephone);
            formData.append("gender", editUserForm.gender);
            formData.append("role_id", editUserForm.role_id);

            if (editUserForm.photo) {
                formData.append("photo", editUserForm.photo);
            }

            if (editUserForm.password && editUserForm.password.trim() !== "") {
                formData.append("password", editUserForm.password);
            }

            editUserForm.application_ids.forEach((access: string) => {
                formData.append("application_ids", access);
            });

            await axiosInstance.put(`/user/edit/${editUserForm.user_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Berhasil memperbarui user", "", "success").then(() => {
                window.location.reload();
            });
            setShowEditUserForm(false);
            setEditUserForm(initialUserForm);
            setPhotoPreview(null);

            const usersRes = await axiosInstance.get("/user/get-all");
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error("Gagal memperbarui user:", error);
            Swal.fire("Gagal memperbarui user", "", "error");
        }
    };

    const updateApp = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editAppForm.name);
            formData.append("redirect_uri", editAppForm.redirect_uri);
            formData.append("icon", editAppForm.icon); 

            await axiosInstance.put(`/apps/edit/${editAppForm.application_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Berhasil mengubah aplikasi", "", "success");
            setShowEditAppForm(false);
            setEditAppForm(initialAppForm);
            setIconPreview(null);

            const appForTableRes = await axiosInstance.get("/apps/get-all");
            setAppForTable(appForTableRes.data.data);
        } catch (error) {
            console.error("Gagal mengubah aplikasi:", error);
            Swal.fire("Gagal mengubah aplikasi", "", "error");
        }
    };

    const toggleActiveUser = async (userId: string, currentStatus: boolean) => {
        try {
            await axiosInstance.patch(`/user/toggle-active/${userId}`);
            const usersRes = await axiosInstance.get(`/user/get-all?page=${currentPageUsers}`);
            setUsers(usersRes.data.data);
            setTotalPagesUsers(Math.ceil(usersRes.data.total / usersRes.data.limit));

            setUsers(usersRes.data.data);
            setTotalPagesUsers(Math.ceil(usersRes.data.total / usersRes.data.limit));


            setUsers(prev =>
                prev.map(user =>
                    user.user_id === userId
                        ? { ...user, is_active: !currentStatus }
                        : user
                )
            );
        } catch (error) {
            console.error(error);
            Swal.fire("Gagal", "Gagal mengubah status user", "error");
        }
    };

    const toggleActiveApp = async (appId: string, currentStatus: boolean) => {
        try {
            await axiosInstance.patch(`/apps/toggle-active/${appId}`);

            const appsRes = await axiosInstance.get(`/apps/get-all?page=${currentPageApps}`);
            setApps(appsRes.data.data);
            setTotalPagesApps(Math.ceil(appsRes.data.total / appsRes.data.limit));

            setAppForTable(prev =>
                prev.map(app =>
                    app.application_id === appId
                        ? { ...app, is_active: !currentStatus }
                        : app
                )
            );
        } catch (error) {
            console.error(error);
            Swal.fire("Gagal", "Gagal mengubah status aplikasi", "error");
        }
    };

    const handleAddUser = () => {
        setShowAddUserForm(true);
    };

    const handleAddApp = () => {
        setShowAddAppForm(true);
    };

    const handleEditUser = (user: User) => {
        setEditUserForm({
            user_id: user.user_id,
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
            password: "", 
            telephone: user.telephone || "",
            gender: user.gender || "",
            role_id: user.role_id || "",
            photo: "", 
            application_ids: user.access_apps?.map(app => app.application_id) || [],
        });
        console.log("ini photo user:", user.photo);
        setPhotoPreview(user.photo || null);
        setShowAddUserForm(false);
        setShowEditUserForm(true);
    };

    const handleEditApp = (app: Application) => {
        setEditAppForm({
            application_id: app.application_id,
            name: app.name || "",
            redirect_uri: app.redirect_uri || "",
            icon: "", 
        });
        setIconPreview(app.icon || null); 
        setShowAddAppForm(false);
        setShowEditAppForm(true);
    };

    return (
        <DashboardLayout title="Admin Panel" centerTitle=" ">
            <Link to="/apps" className="mt-3 mb-4 inline-block text-white bg-green-600 px-4 py-3 rounded-md text-blue-600 hover:bg-green-700">
                <ArrowLeft size={20} className="inline-block" /><span className="ml-2 pr-2">Kembali</span>
            </Link>

            <TabSwitcher
                activeTab={activeTab}
                onChange={(tab) => setActiveTab(tab)}
                tabs={[
                    { label: "Users", value: "users" },
                    { label: "Applications", value: "apps" }
                ]}
            />

            <div className="space-y-10">
                {activeTab === "users" && (
                    <UserSection
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleAddUser={handleAddUser}
                        handleEditUser={handleEditUser}
                        toggleActiveUser={toggleActiveUser}
                        users={users}
                        currentPageUsers={currentPageUsers}
                        setCurrentPageUsers={setCurrentPageUsers}
                        totalPagesUsers={totalPagesUsers}
                    />
                )}

                {activeTab === "apps" && (
                    <ApplicationSection
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleAddApp={handleAddApp}
                        handleEditApp={handleEditApp}
                        toggleActiveApp={toggleActiveApp}
                        appForTable={appForTable}
                        currentPageApps={currentPageApps}
                        setCurrentPageApps={setCurrentPageApps}
                        totalPagesApps={totalPagesApps}
                    />
                )}
            </div>

            <AddAppModal
                show={showAddAppForm}
                onClose={() => {
                    setShowAddAppForm(false);
                    setAddAppForm(initialAppForm);
                    setIconPreview(null);
                }}
                onSubmit={createApp}
                form={addAppForm}
                setForm={setAddAppForm}
                iconPreview={iconPreview}
                setIconPreview={setIconPreview}
            />

            <EditAppModal
                show={showEditAppForm}
                onClose={() => {
                    setShowEditAppForm(false);
                    setEditAppForm(initialAppForm);
                    setIconPreview(null);
                }}
                onSubmit={updateApp}
                form={editAppForm}
                setForm={setEditAppForm}
                iconPreview={iconPreview}
                setIconPreview={setIconPreview}
            />

            <AddUserModal
                show={showAddUserForm}
                onClose={() => {
                    setShowAddUserForm(false);
                    setAddUserForm(initialUserForm);
                    setPhotoPreview(null);
                }}
                onSubmit={createUser}
                roles={roles}
                applications={apps}
                form={addUserForm}
                setForm={setAddUserForm}
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
            />

            <EditUserModal
                show={showEditUserForm}
                onClose={() => {
                    setShowEditUserForm(false)
                    setEditUserForm(initialUserForm);
                    setPhotoPreview(null);
                }}
                onSubmit={updateUser}
                roles={roles}
                applications={apps}
                form={editUserForm}
                setForm={setEditUserForm}
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
            />
        </DashboardLayout >
    );
}
