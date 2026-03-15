import { execSync } from "child_process";
import { store } from "../store";

type Platform = "win32" | "darwin" | "linux";

function getPlatform(): Platform {
    const p = process.platform;
    if (p === "win32" || p === "darwin" || p === "linux") return p;
    return "linux";
}

function getWineInstall(): string | null {
    if (store.get("winepath")) {
        return store.get("winepath") as string | null;
    }

    if (process.platform === "win32") return null;

    const binaries = ["wine64", "wine"];
    for (const bin of binaries) {
        try {
            const pth = execSync(`which ${bin}`, {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
            }).trim();
            store.set("winepath", pth);
            return pth;
        } catch {
            continue;
        }
    }
    return null;
}

export function generateLaunchCommand(
    mainExecutable: string,
    args: Record<string, string | number>,
    flags: string[],
): string {
    const platform = getPlatform();
    const commandParts: string[] = [];

    if (platform !== "win32") {
        const wine = getWineInstall();
        if (!wine) throw new Error("Wine not found");
        commandParts.push(wine);
    }

    commandParts.push(`"${mainExecutable}"`);

    flags.forEach((flag) => {
        commandParts.push(`${flag}`);
    });

    Object.entries(args).forEach(([key, value]) => {
        commandParts.push(`${key}`, `${value}`);
    });

    console.log(commandParts.join(" "));

    return commandParts.join(" ");
}
