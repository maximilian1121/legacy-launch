/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import "./main-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: any | null = null;

function updatePanorama(url: string) {
    const img = new Image();
    img.src = `panos/${url}.png`;

    img.onload = () => {
        const root = document.documentElement;

        const aspect = img.naturalWidth / img.naturalHeight;

        root.style.setProperty("--ratio", aspect.toString());
        root.style.setProperty("--bg-url", `url(${img.src})`);
    };
}

window.electronAPI.onRefreshConfig((newConfig) => {
    config = newConfig;
    updatePanorama(config.pano);
});

async function getConfig() {
    config = await window.electronAPI.getStoreValue("settings");
    updatePanorama(config.pano);
}
getConfig();

const hoverSound = new Audio("ui_focus.wav");
const clickSound = new Audio("ui_click.wav");
const backSound = new Audio("ui_back.wav");
hoverSound.load();
hoverSound.volume = 0.2;
clickSound.load();
clickSound.volume = 0.1;

let lastHoveredButton: HTMLButtonElement | null = null;

document.addEventListener("mouseover", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>("button:not(.no-sfx)");

    if (btn && !btn.disabled && btn !== lastHoveredButton) {
        lastHoveredButton = btn;

        hoverSound.currentTime = 0;

        if (config && config.sfx)
            hoverSound.play().catch(() => {
                return;
            });
    }
});

document.addEventListener("mouseout", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>("button:not(.no-sfx)");

    if (
        btn &&
        event.relatedTarget &&
        !btn.contains(event.relatedTarget as Node)
    ) {
        lastHoveredButton = null;
    }
});

document.addEventListener("mousedown", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>("button:not(.no-sfx)");

    if (btn && !btn.disabled) {
        clickSound.currentTime = 0;
        if (!config || !config.sfx) return;
        if (btn.classList.contains("back-sfx"))
            backSound.play().catch(() => {
                return;
            });
        else
            clickSound.play().catch(() => {
                return;
            });
    }
});
