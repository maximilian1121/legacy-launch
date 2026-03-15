import {
    Close,
    MinimizeOutlined,
    MinimizeRounded,
    SquareOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

const Titlebar = () => {
    const [showTitlebar, setShowTitlebar] = useState(false);

    const controls = [
        { label: <MinimizeOutlined />, action: "minimize" },
        { label: <SquareOutlined />, action: "maximize" },
        { label: <Close />, action: "close" },
    ];

    const updateTitlebarVisibility = async () => {
        setShowTitlebar(
            !(await window.electronAPI.getStoreValue("settings.system_frame")),
        );
    };

    useEffect(() => {
        updateTitlebarVisibility();
    });

    const handleAction = (action: string) => {
        // Accessing the API exposed via contextBridge in preload.ts
        const api = (window as any).windowAPI;

        if (api && typeof api[action] === "function") {
            api[action]();
        }
    };

    if (!showTitlebar) {
        return <></>;
    }

    return (
        <div className="titlebar flex h-8 w-full select-none items-center justify-between bg-stone-900 cursor-default">
            {/* Draggable Area - Ensure "-webkit-app-region: drag" is in your CSS for .titlebar-drag */}
            <div className="titlebar-drag flex flex-1 items-center h-full px-4">
                <span className="text-xs text-stone-400 font-medium">
                    Legacy Launch
                </span>
            </div>

            <div className="flex h-full no-drag">
                {controls.map((btn) => (
                    <button
                        key={btn.action}
                        onClick={() => handleAction(btn.action)}
                        className={`
                            flex h-full w-12 items-center justify-center text-white transition-colors 
                            ${
                                btn.action === "close"
                                    ? "hover:bg-red-600 active:bg-red-700"
                                    : "hover:bg-stone-800 active:bg-stone-700"
                            }
                        `}
                    >
                        <span className="text-sm font-light">{btn.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Titlebar;
