import DashboardLayout from "../layouts/DashboardLayout";

export default function AppsPage() {
    const apps = [
        { name: "Aplikasi 1", link: "/apps/app1" },
        { name: "Aplikasi 2", link: "/apps/app2" },
        { name: "Aplikasi 3", link: "/apps/app3" },
        { name: "Aplikasi 4", link: "/apps/app4" },
    ];

    return (
        <DashboardLayout title="Daftar Aplikasi">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app, index) => (
                    <a
                        key={index}
                        href={app.link}
                        className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100 hover:border-blue-500"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{app.name}</h3>
                        <p className="text-sm text-blue-600 mt-1">Klik untuk membuka</p>
                    </a>
                ))}
            </section>
        </DashboardLayout>
    );
}
