import { contextBridge, ipcRenderer } from "electron";

export interface IElectronAPI {
    [x: string]: any;
    createProfile: (data: {
        channel: string;
        name: string;
    }) => Promise<{ message: string }>;
    launchProfile: (data: unknown) => Promise<any>;
    getProfiles: (data?: unknown) => Promise<any>;
    getStoreValue: (key: string) => Promise<any>;
    setStoreValue: (key: string, value: unknown) => void;
    // New method for opening external links
    openExternal: (url: string) => Promise<void>;
    showConfirmation: (
        options: any,
    ) => Promise<{ response: number; checkboxChecked: boolean }>;
    setNewSkin: (options: any) => Promise<any>;
    resetSkin: (options: any) => Promise<any>;
    onRefreshProfiles: (callback: (newProfiles: any) => void) => () => void;
    onRefreshConfig: (callback: (newConfig: any) => void) => () => void;
    onSkinUpdated: (callback: (newConfig: any) => void) => () => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
        windowAPI: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
    }
}

contextBridge.exposeInMainWorld("electronAPI", {
    createProfile: (data: unknown) =>
        ipcRenderer.invoke("create-profile-action", data),
    launchProfile: (data: unknown) =>
        ipcRenderer.invoke("launch-profile-action", data),
    getProfiles: (data: unknown) =>
        ipcRenderer.invoke("get-profiles-action", data),
    getStoreValue: (key: unknown) => ipcRenderer.invoke("get-store-value", key),
    setStoreValue: (key: unknown, value: unknown) =>
        ipcRenderer.send("set-store-value", key, value),
    openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
    showConfirmation: (options: any) =>
        ipcRenderer.invoke("show-confirmation", options),
    setNewSkin: (options: any) => ipcRenderer.invoke("set-new-skin", options),
    resetSkin: (options: any) => ipcRenderer.invoke("reset-skin", options),
    onRefreshProfiles: (callback: (newProfiles: any) => void) => {
        // We capture 'data' from Electron and pass it to your React callback
        const subscription = (_event: any, data: any) => callback(data);

        ipcRenderer.on("refresh-profile-list", subscription);

        return () => {
            ipcRenderer.removeListener("refresh-profile-list", subscription);
        };
    },
    onRefreshConfig: (callback: (newConfig: any) => void) => {
        // We capture 'data' from Electron and pass it to your React callback
        const subscription = (_event: any, data: any) => callback(data);

        ipcRenderer.on("refresh-config", subscription);

        return () => {
            ipcRenderer.removeListener("refresh-config", subscription);
        };
    },
    onSkinUpdated: (callback: (newSkin: any) => void) => {
        // We capture 'data' from Electron and pass it to your React callback
        const subscription = (_event: any, data: any) => callback(data);

        ipcRenderer.on("skin-updated", subscription);

        return () => {
            ipcRenderer.removeListener("skin-updated", subscription);
        };
    },
});

contextBridge.exposeInMainWorld("windowAPI", {
    minimize: () => ipcRenderer.send("window-control", "minimize"),
    maximize: () => ipcRenderer.send("window-control", "maximize"),
    close: () => ipcRenderer.send("window-control", "close"),
});
