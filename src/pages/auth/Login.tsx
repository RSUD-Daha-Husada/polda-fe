import { useEffect, useRef, useState } from "react";
import type { WindowWithYT } from "../../types/youtube";
import axiosInstance from "../../utils/axios";
import type { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

function formatErrorMessage(msg: string | null) {
    if (!msg) return "";
    const trimmed = msg.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return capitalized.endsWith("!") ? capitalized : capitalized + "!";
}

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);


    const [useCodeLogin, setUseCodeLogin] = useState(true);

    const [code, setCode] = useState("");

    const [loadingKode, setLoadingKode] = useState(false);

    const handleGetCode = async () => {
        if (!username) {
            setErrorMessage("Username tidak boleh kosong");
            return;
        }

        setLoadingKode(true);
        setErrorMessage(null); 

        try {
            await axiosInstance.post("/auth/request-code", { username });
        } catch (error: unknown) {
            const err = error as AxiosError<{ error?: string; message?: string }>;
            const msg = err.response?.data?.error || err.response?.data?.message || "Gagal mengirim kode";
            setErrorMessage(msg);
        } finally {
            setLoadingKode(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); 

        try {
            const endpoint = useCodeLogin
                ? "/auth/login-code"
                : "/auth/login";

            const body = useCodeLogin
                ? { username, code }
                : { username, password };

            const response = await axiosInstance.post(endpoint, body);
            const token = response.data?.token;

            if (!token) throw new Error("Token tidak ditemukan");

            localStorage.setItem("token", token);
            window.location.href = "/dashboard";
        } catch (error: unknown) {
            const err = error as AxiosError<{ error?: string; message?: string }>;
            const msg = err.response?.data?.error || err.response?.data?.message || "Login gagal";
            setErrorMessage(msg);
        }
    };

    const playerRef = useRef<YT.Player | null>(null);

    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.textContent = `
      #greeting::after {
        content: '|';
        animation: blink 1s infinite;
        color: #10b981;
      }
      @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
      #player, #player-container { width:100vw; height:100vh; }
      #player iframe {
        width:100%!important; height:100%!important;
        position:absolute; inset:0; object-fit:cover;
        z-index:0; pointer-events:none;
      }
    `;
        document.head.appendChild(styleTag);

        const YT_SRC = "https://www.youtube.com/iframe_api";
        if (!document.querySelector(`script[src="${YT_SRC}"]`)) {
            const s = document.createElement("script");
            s.src = YT_SRC;
            s.async = true;
            document.body.appendChild(s);
        }

        const videoIds = [
            "6VmfsNvD-s4",
            "PR9i36xfFSA",
            "Cas8IQ_3mdE",
            "o03t85SvQpo",
        ];

        const getRandomVideoId = (excludeId?: string) => {
            const pool = videoIds.filter((id) => id !== excludeId);
            return pool[Math.floor(Math.random() * pool.length)];
        };



        const createPlayer = () => {
            const firstId = getRandomVideoId();
            playerRef.current = new (window as typeof globalThis).YT.Player("player", {
                width: "100%",
                height: "100%",
                videoId: firstId,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    loop: 1,
                    playlist: firstId,
                },
                events: {
                    onReady: (event: YT.PlayerEvent) => event.target.playVideo(),
                    onStateChange: (event: YT.OnStateChangeEvent) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            if (playerRef.current) {
                                const nextId = getRandomVideoId(playerRef.current.getVideoData().video_id);
                                playerRef.current.loadVideoById(nextId);
                            }
                        }
                    },
                },
            });
        };

        const waitForYT = () => {
            const win = window as WindowWithYT;
            if (win.YT && win.YT.Player) {
                createPlayer();
            } else {
                setTimeout(waitForYT, 100);
            }
        };

        waitForYT();

        const hour = new Date().getHours();
        const greetings =
            hour >= 4 && hour < 11
                ? ["Selamat Pagi Sobat Daha ", "Selamat Datang di PolDha! "]
                : hour < 15
                    ? ["Selamat Siang Sobat Daha ", "Selamat Datang di PolDha! "]
                    : hour < 18
                        ? ["Selamat Sore Sobat Daha ", "Selamat Datang di PolDha! "]
                        : ["Selamat Malam Sobat Daha ", "Selamat Datang di PolDha! "];

        const greetingEl = document.getElementById("greeting");
        let gIndex = 0,
            cIndex = 0,
            deleting = false;

        const loop = () => {
            const full = greetings[gIndex];
            const text = deleting ? full.slice(0, cIndex--) : full.slice(0, cIndex++);
            if (greetingEl) greetingEl.textContent = text;
            let delay = deleting ? 50 : 100;
            if (!deleting && cIndex === full.length) {
                delay = 1500; deleting = true;
            } else if (deleting && cIndex < 0) {
                deleting = false; gIndex = (gIndex + 1) % greetings.length; cIndex = 0; delay = 1000;
            }
            setTimeout(loop, delay);
        };
        loop();

        return () => {
            styleTag.remove();
            if (playerRef.current) playerRef.current.destroy();
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Video background */}
            <div id="player-container" className="absolute inset-0">
                <div id="player" />
            </div>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-[1]" />

            <div className="relative z-[2] flex min-h-screen">
                {/* Left side */}
                <div className="w-2/3 flex flex-col text-white p-10">
                    <img src="/assets/logo/logo-dh.png" alt="Logo Daha Husada" className="w-20 h-auto" />
                    <div className="mt-auto ml-20 mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}>
                            <span id="greeting" className="whitespace-nowrap" />
                        </h2>
                        <p className="mt-4 text-xl max-w-5xl" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}>
                            Sistem Single Sign‑On RSUD Daha Husada untuk mengakses semua layanan digital secara terintegrasi dan efisien.
                        </p>
                    </div>
                </div>

                {/* Right side – Login form */}
                <div className="w-1/3 bg-black/50 flex items-center justify-center p-12">
                    <div className="w-full max-w-md flex flex-col items-center">
                        <h2 className="text-3xl font-semibold text-white text-center mb-10">
                            {useCodeLogin ? "Login dengan Kode" : "Silahkan Login"}
                        </h2>

                        <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
                            {errorMessage && (
                                <div className="mb-2 w-[80%] text-red-500 text-sm font-medium">
                                    {formatErrorMessage(errorMessage)}
                                </div>
                            )}

                            <div className="mb-4 w-[80%]">
                                <label htmlFor="username" className="block text-white text-lg mb-2">Username</label>
                                {useCodeLogin ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="example"
                                            className="flex-1 bg-white text-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGetCode}
                                            className="text-sm cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            disabled={loadingKode}
                                        >
                                            {loadingKode ? "Mengirim..." : "Get Kode"}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="example"
                                        className="w-full bg-white text-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                )}
                            </div>

                            {useCodeLogin ? (
                                <div className="mb-6 w-[80%]">
                                    <label htmlFor="code" className="block text-white text-lg mb-2">Kode</label>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Masukkan kode"
                                        className="w-full bg-white text-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="mb-6 w-[80%]">
                                    <label htmlFor="password" className="block text-white text-lg mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Masukkan password"
                                            className="w-full bg-white text-lg px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                            )}

                            <button
                                type="submit"
                                className="w-[80%] cursor-pointer text-xl bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Login
                            </button>

                            <p className="mt-4 text-white cursor-pointer" onClick={() => setUseCodeLogin(!useCodeLogin)}>
                                {useCodeLogin ? "Login dengan Password?" : "Login dengan Kode?"}
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}