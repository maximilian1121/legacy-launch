import { useEffect, useState } from "react";
import CreateProfileDialog from "./components/CreateProfileDialog";
import IconButton from "./components/IconButton";
import Processing from "./components/Processing";
import ProfileCard from "./components/ProfileCard";
import SettingsMenu from "./components/SettingsMenu";
import { Profile } from "./types";
import { IoMdAdd, IoMdSettings } from "react-icons/io";
import MinecraftText from "minecraft-formatted-text-react";

export default function App() {
    const [creatingProfile, setCreatingProfile] = useState(false);
    const [splash, setSplash] = useState("");
    const [inSettings, setInSettings] = useState(false);
    const [creatingProfileProcessing, setCreatingProfileProcessing] =
        useState(false);
    const [profiles, setProfiles] = useState<Profile[] | null>();

    const updateProfiles = async () => {
        try {
            const response = await window.electronAPI.getProfiles();
            setProfiles(response);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    };

    const updateSplash = async () => {
        try {
            const splashesTXTResponse = await fetch("splashes.txt");
            const splashesTXTText = await splashesTXTResponse.text();

            const lines = splashesTXTText
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "");

            if (lines.length > 0) {
                const randomIndex = Math.floor(Math.random() * lines.length);

                const randomSplash = lines[randomIndex];

                setSplash(randomSplash);
            }
        } catch (error) {
            console.error("Failed to fetch splashes:", error);
        }
    };

    useEffect(() => {
        updateProfiles();
        updateSplash();

        const removeListener = window.electronAPI.onRefreshProfiles(
            (newProfiles: any) => {
                console.log(newProfiles);
                setProfiles(newProfiles as Profile[]);
            },
        );

        return () => {
            removeListener();
        };
    }, []);

    return (
        <div className="flex flex-col h-screen w-screen top-0 bottom-0 left-0 right-0 fixed gap-2">
            <div className="flex flex-col items-center pt-4 shrink-0">
                <div className="flex justify-center px-4 h-32 w-fit relative">
                    <img
                        src="lce_logo_blockbench_render.png"
                        className="w-full max-w-100 h-full object-contain select-none"
                        alt="Logo"
                        draggable={false}
                    />
                    <p
                        className="absolute right-[10%] bottom-2 translate-x-1/2 text-center select-none 
             origin-center animate-splash-pulse whitespace-nowrap text-shadow-[3px_3px_0_#00000080]"
                        style={{
                            fontSize: `${Math.max(12, 30 - splash.length * 0.5)}px`,
                        }}
                        onClick={updateSplash}
                    >
                        <MinecraftText>{"§e" + splash}</MinecraftText>
                    </p>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto w-screen px-4 py-4">
                <div className="flex flex-col w-full gap-2">
                    {profiles &&
                        Object.entries(profiles).map(([id, data]) => (
                            <ProfileCard
                                key={id}
                                id={id}
                                name={data.name}
                                source={data.source}
                            />
                        ))}
                </div>
            </main>

            <CreateProfileDialog
                open={creatingProfile}
                onClose={(startProcessing) => {
                    setCreatingProfile(false);
                    setCreatingProfileProcessing(startProcessing);
                }}
                stopProcessing={() => setCreatingProfileProcessing(false)}
            />
            <Processing
                title="Creating profile"
                open={creatingProfileProcessing}
            />
            <SettingsMenu
                open={inSettings}
                onClose={() => setInSettings(false)}
            />

            <footer className="w-full flex justify-between px-8 items-center bg-[oklch(21.6%_0.006_56.043/90%)] py-4 border-t border-white/10">
                <IconButton
                    onClick={() => setInSettings(true)}
                    variant="secondary"
                >
                    <IoMdSettings className="text-3xl" />
                </IconButton>

                <IconButton
                    onClick={() => setCreatingProfile(true)}
                    variant="secondary"
                >
                    <IoMdAdd className="text-3xl" />
                </IconButton>
            </footer>
        </div>
    );
}
