type TabSwitcherProps = {
    activeTab: "users" | "apps";
    onChange: (tab: "users" | "apps") => void;
    tabs: { label: string; value: "users" | "apps" }[];
};

export default function TabSwitcher({ activeTab, onChange, tabs }: TabSwitcherProps) {
    return (
        <div className="flex justify-center mb-6 space-x-4">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`px-4 py-2 rounded font-medium cursor-pointer ${
                        activeTab === tab.value
                            ? "bg-green-600 text-white"
                            : "bg-white border border-gray-300"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
