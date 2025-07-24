import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useUser } from "../hooks/useUser";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

const quotes = [
    "Kerja keras hari ini adalah kunci sukses esok hari.",
    "Setiap langkah kecil adalah bagian dari perjalanan besar.",
    "Jangan takut gagal, takutlah untuk tidak mencoba.",
    "Kesuksesan datang pada mereka yang terus belajar dan mencoba.",
    "Semangat! Hari ini adalah kesempatan baru.",
];

function getGreeting(): string {
    const hour = dayjs().hour();
    if (hour >= 5 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
}

export default function DashboardPage() {
    const { user } = useUser();
    const [quote, setQuote] = useState("");
    const greeting = getGreeting();

    useEffect(() => {
        // Pilih quote acak
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    console.log("user", user);


    return (
        <DashboardLayout title="Dashboard" centerTitle=" ">
            <section className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {greeting}, {user?.username || "Pengguna"} 👋
                    </h2>
                    <p className="text-sm text-gray-600">
                        Terakhir login:{" "}
                        {user?.lastLogin
                            ? dayjs(user.lastLogin).format("DD MMMM YYYY, HH:mm [WIB]")
                            : "Belum ada data login"}
                    </p>

                </div>

                <div className="bg-green-100 p-6 rounded-xl shadow-md">
                    <h3 className="text-md font-semibold text-green-800 mb-2">Motivasi Hari Ini 💡</h3>
                    <p className="text-gray-700 italic">"{quote}"</p>
                </div>
            </section>
        </DashboardLayout>
    );
}
