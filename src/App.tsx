import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useEffect, useState } from "react";
import Button from "./components/Button";
import CreateProfileDialog from "./components/CreateProfileDialog";
import IconButton from "./components/IconButton";
import ProfileCard from "./components/ProfileCard";
import { Profile } from "./types";
import { AddRounded } from "@mui/icons-material";
import Processing from "./components/Processing";
import SettingsMenu from "./components/SettingsMenu";
import SkinViewer from "./components/SkinViewer";
import Dialog from "./components/Dialog";
import ProfileMenu from "./components/ProfileMenu";

export default function App() {
    const [creatingProfile, setCreatingProfile] = useState(false);
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

    useEffect(() => {
        updateProfiles();

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
        <div>
            <span>
                {profiles &&
                    Object.entries(profiles).map(([id, data]) => (
                        <ProfileCard
                            key={id}
                            id={id}
                            name={data.name}
                            source={data.source}
                        />
                    ))}
            </span>
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

            <div className="w-full flex justify-between px-8 items-center bg-[oklch(21.6%_0.006_56.043/90%)] py-4 fixed bottom-0 left-0 right-0">
                <IconButton
                    onClick={() => setInSettings(true)}
                    variant="secondary"
                    className=""
                >
                    <SettingsRoundedIcon
                        sx={{ color: "white", fontSize: "2.5rem" }}
                    />
                </IconButton>

                {/* <Button className="px-12 h-full max-h-full text-2xl">
                    Play <PlayArrowRoundedIcon sx={{ fontSize: 50 }} />
                </Button> */}

                <IconButton
                    onClick={() => setCreatingProfile(true)}
                    variant="secondary"
                    className=""
                >
                    <AddRounded sx={{ color: "white", fontSize: "2.5rem" }} />
                </IconButton>
            </div>
        </div>
    );
}
