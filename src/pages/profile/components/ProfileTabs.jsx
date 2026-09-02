import { useState } from "react";

export function ProfileTabs({ activeTab: externalActiveTab, onTabChange }) {
    const [internalActiveTab, setInternalActiveTab] = useState("classes");

    const currentTab = externalActiveTab || internalActiveTab;

    const handleTabClick = (tabId) => {
        if (onTabChange) {
            onTabChange(tabId);
        } else {
            setInternalActiveTab(tabId);
        }
    };

    const tabs = [
        {
            id: "classes",
            label: "Classes",
            count: 13
        },
        {
            id: "discussions",
            label: "Discussions",
            count: 21
        },
        {
            id: "materials",
            label: "Materials",
            count: 9
        },
        {
            id: "more",
            label: "......"
        },
    ];

    return (
        <div className="flex border-b border-gray-200 px-4 sm:px-6 overflow-x-auto scrollbar-none gap-6 sm:gap-8 bg-white">
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center gap-2 py-3.5 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                            ? "border-black text-black font-semibold"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                            }`}
                    >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                    ? "bg-gray-100 text-gray-900 font-semibold"
                                    : "bg-gray-50 text-gray-500"
                                    }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}