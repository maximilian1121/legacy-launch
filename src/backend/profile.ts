import path from "node:path";
import fs from "node:fs";
import extract from "extract-zip";
import { app_dir, store } from "../store";
import { randomUUID } from "node:crypto";
import axios from "axios";
import { pipeline } from "node:stream/promises";
import { generateLaunchCommand } from "./command";
import { Profile } from "../types";
import { shell } from "electron";
import { exec } from "node:child_process";
import { mainWindow } from "../main";

const profiles_dir = path.join(app_dir, "profiles");
const cache_dir = path.join(app_dir, "cache");

if (!fs.existsSync(cache_dir)) {
    fs.mkdirSync(cache_dir, { recursive: true });
}

export type releaseChannel = "nightly" | "Faucet";
export type releaseChannelData = {
    url: string;
    executablePath: string;
    args?: Record<string, unknown>;
    flags?: Record<string, boolean>;
};

export const releaseChannels: Record<releaseChannel, releaseChannelData> = {
    nightly: {
        url: "https://github.com/smartcmd/MinecraftConsoles/releases/download/nightly/LCEWindows64.zip",
        executablePath: "Minecraft.Client.exe",
        args: { "-port": 25565, "-bind": "0.0.0.0", "-name": "Steve" },
        flags: {
            "-server": false,
        },
    },
    Faucet: {
        url: "https://github.com/ytsodacan/Faucet/releases/download/V0.2/FaucetV0.2.zip",
        executablePath: "Minecraft.Client.exe",
        args: { "-port": 25565, "-bind": "0.0.0.0", "-name": "Steve" },
        flags: {
            "-server": false,
        },
    },
};

export async function createProfile(channel: releaseChannel, name: string) {
    const profile_id = randomUUID();
    const profile_dir = path.join(profiles_dir, profile_id);
    const fileName = path.basename(releaseChannels[channel].url);

    const cache_path = path.join(cache_dir, fileName);
    const destination_zip = path.join(profile_dir, "LCE.zip");

    fs.mkdirSync(profile_dir, { recursive: true });

    if (!fs.existsSync(cache_path)) {
        console.log(`Downloading ${channel} to cache...`);
        const response = await axios.get(releaseChannels[channel].url, {
            responseType: "stream",
        });
        const writer = fs.createWriteStream(cache_path);
        await pipeline(response.data, writer);
    } else {
        console.log(`Using cached version for ${channel}`);
    }

    fs.copyFileSync(cache_path, destination_zip);

    try {
        console.log(`Extracting ${channel}...`);
        await extract(destination_zip, { dir: profile_dir });
        console.log("Extraction complete.");
    } catch (err) {
        console.error("Extraction failed:", err);
        throw err;
    } finally {
        if (fs.existsSync(destination_zip)) {
            fs.unlinkSync(destination_zip);
        }
    }

    store.set(`profiles.${profile_id}`, {
        name,
        source: channel,
        flags: releaseChannels[channel].flags,
        args: releaseChannels[channel].args,
    });

    return store.get("profiles");
}

export async function deleteProfile(profile_id: string) {
    const doesExist = store.get(`profiles.${profile_id}`);
    if (doesExist === null)
        return [false, `Profile with id ${profile_id} does not exist!`];

    store.set(`profiles.${profile_id}`, null);

    const profile_dir = path.join(profiles_dir, profile_id);
    fs.rmSync(profile_dir, { recursive: true });

    return true;
}

export async function launchProfile(profile_id: string) {
    const profileData = store.get(`profiles.${profile_id}`) as Profile;
    if (!profileData)
        return [false, `Profile with id ${profile_id} does not exist!`];

    const profile_dir = path.join(profiles_dir, profile_id);
    const doesDirExist = await fs.existsSync(profile_dir);
    if (!doesDirExist)
        [false, `Profile with id ${profile_id}'s directory does not exist!`];

    const channel = profileData.source;
    const fullExePath = path.resolve(
        profile_dir,
        releaseChannels[channel as releaseChannel].executablePath,
    );

    const flagList: string[] = [];

    Object.keys(profileData.flags).forEach((flag) => {
        if (profileData.flags[flag]) flagList.push(flag);
    });

    mainWindow.minimize();

    const command = generateLaunchCommand(
        fullExePath,
        profileData.args,
        flagList,
    );

    exec(command);

    return true;
}
