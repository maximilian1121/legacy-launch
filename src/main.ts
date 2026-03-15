import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    net,
    protocol,
    shell,
} from "electron";
import started from "electron-squirrel-startup";
import { Jimp } from "jimp";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createProfile, deleteProfile, launchProfile } from "./backend/profile";
import { app_dir, store } from "./store";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

export let mainWindow: BrowserWindow | null = null;

const isLockObtained = app.requestSingleInstanceLock();

if (!isLockObtained || started) {
    app.quit();
} else {
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        transparent: true,
        frame: store.get("settings.system_frame"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        );
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

protocol.registerSchemesAsPrivileged([
    {
        scheme: "app-assets",
        privileges: { secure: true, standard: true, supportFetchAPI: true },
    },
]);

app.on("ready", () => {
    protocol.handle("app-assets", (request) => {
        const userDataPath = app.getPath("userData");
        const url = new URL(request.url);

        let relativePath = decodeURIComponent(url.hostname + url.pathname);

        if (relativePath.endsWith("/")) {
            relativePath = relativePath.slice(0, -1);
        }

        const fullPath = path.join(userDataPath, relativePath);

        return net.fetch(pathToFileURL(fullPath).toString());
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const profiles_dir = path.join(app_dir, "profiles");
if (!fs.existsSync(profiles_dir)) {
    fs.mkdirSync(profiles_dir, { recursive: true });
}

// --- IPC Handlers ---
ipcMain.handle("create-profile-action", async (event, data) => {
    const result = await createProfile(data.channel, data.name);
    event.sender.send("refresh-profile-list", store.get("profiles"));
    return result;
});

ipcMain.handle("delete-profile-action", async (event, data) => {
    await deleteProfile(data.id);
    event.sender.send("refresh-profile-list", store.get("profiles"));
});

ipcMain.handle("launch-profile-action", async (event, data) => {
    await launchProfile(data);
    event.sender.send("refresh-profile-list", store.get("profiles"));
});

ipcMain.handle("get-profiles-action", async () => {
    return store.get("profiles");
});

ipcMain.on("window-control", (event, action) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;

    switch (action) {
        case "minimize":
            win.minimize();
            break;
        case "maximize":
            win.isMaximized() ? win.unmaximize() : win.maximize();
            break;
        case "close":
            win.close();
            break;
    }
});

ipcMain.handle("get-store-value", (_, key) => store.get(key));

ipcMain.on("set-store-value", (event, key, value) => {
    store.set(key, value);
    event.sender.send("refresh-config", store.get("settings"));
});

ipcMain.handle("open-external", async (_, url) => {
    await shell.openExternal(url);
});

ipcMain.handle("show-confirmation", async (event, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);

    return await dialog.showMessageBox(win, options);
});

async function cropWithJimp(source: string, skins_dir: string, skin: string) {
    const image = await Jimp.read(source);

    image.crop({ x: 0, y: 0, w: 64, h: 32 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await image.write(path.join(skins_dir, skin) as any);
}

ipcMain.handle("set-new-skin", async (event, data) => {
    const win = BrowserWindow.fromWebContents(event.sender);

    const response = await dialog.showOpenDialog(win, data.options);

    if (response.canceled) return;

    const profile = data.profile;
    const skin = data.skin;

    const source = response.filePaths[0];

    const skins_dir = path.join(profiles_dir, profile, "Common/res/mob");

    if (!fs.existsSync(path.join(skins_dir, "bak" + skin))) {
        fs.copyFileSync(
            path.join(skins_dir, skin),
            path.join(skins_dir, "bak" + skin),
        );
    }

    cropWithJimp(source, skins_dir, skin);

    event.sender.send("skin-updated", {
        profile,
        skin,
    });
});

ipcMain.handle("reset-skin", async (event, data) => {
    const profile = data.profile;
    const skin = data.skin;
    const skins_dir = path.join(profiles_dir, profile, "Common/res/mob");

    if (fs.existsSync(path.join(skins_dir, "bak" + skin))) {
        fs.copyFileSync(
            path.join(skins_dir, "bak" + skin),
            path.join(skins_dir, skin),
        );
        fs.rmSync(path.join(skins_dir, "bak" + skin));
    }

    event.sender.send("skin-updated", {
        profile,
        skin,
    });
});
