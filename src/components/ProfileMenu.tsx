import { useEffect, useState } from "react";
import Divider from "./Divider";
import SkinViewer from "./SkinViewer";
import Select from "./Select";
import Button from "./Button";

type ProfileMenuProps = {
    open: boolean;
    onClose: () => void;
    profileId: string;
};

export default function ProfileMenu({
    open,
    onClose,
    profileId,
}: ProfileMenuProps) {
    const [profileName, setProfileName] = useState("");
    const [skin, setSkin] = useState("char.png");
    const [skinVer, setSkinVer] = useState(0);
    const [boxOpen, setBoxOpen] = useState(false);

    const skins = [
        "char.png",
        "char1.png",
        "char2.png",
        "char3.png",
        "char4.png",
        "char5.png",
        "char6.png",
        "char7.png",
    ];

    const updateProfileName = async () => {
        setProfileName(
            await window.electronAPI.getStoreValue(
                `profiles.${profileId}.name`,
            ),
        );
    };

    useEffect(() => {
        const cleanup = window.electronAPI.onSkinUpdated(async () => {
            setSkinVer((prev) => prev + 1);
        });
        updateProfileName();

        return () => cleanup();
    }, [open]);

    return (
        <div
            className={`${!open && "hidden"} aspect-square w-screen h-screen bg-[rgba(0,0,0,0.2)] 
        fixed top-0 left-0 bottom-0 right-0 z-100 flex
        justify-center items-center align-middle`}
        >
            <div className="fixed flex flex-col text-white bg-stone-700 px-4 py-4 min-w-[90vw] min-h-[90vh] max-h-[90vh] shadow-xl rounded-2xl shadow-stone-900">
                <span className="flex justify-between align-middle items-center">
                    <h1 className="text-2xl">Profile - {profileName}</h1>
                    <span className="flex justify-end">
                        <Button className="back-sfx" onClick={onClose}>
                            Close
                        </Button>
                    </span>
                </span>
                <Divider />
                <div className="gap-2 flex flex-col h-full overflow-auto">
                    <h1 className="text-xl">Skin slots</h1>
                    <Select
                        options={skins.map((skin, index) => ({
                            label: `Skin ${index + 1}`,
                            value: skin,
                        }))}
                        value={skin}
                        onChange={(e) => setSkin(e.target.value)}
                    />

                    <div className="flex h-100 gap-2">
                        {open && (
                            <SkinViewer
                                skinName={skin}
                                skinVer={skinVer}
                                profileId={profileId}
                            />
                        )}
                        <Divider direction="vertical" />
                        <div className="flex flex-col gap-2">
                            <h1>Options</h1>
                            <Divider />
                            <Button
                                onClick={async () => {
                                    if (boxOpen) return;
                                    setBoxOpen(true);
                                    await window.electronAPI.setNewSkin({
                                        options: {
                                            title: "Select new skin",
                                            buttonLabel: "Select Skin",
                                            filters: [
                                                {
                                                    name: "PNG files",
                                                    extensions: ".png",
                                                },
                                            ],
                                        },
                                        profile: profileId,
                                        skin,
                                    });
                                    setBoxOpen(false);
                                }}
                            >
                                Add new
                            </Button>
                            <Button
                                variant="secondary"
                                title="Resets the skin back to the default minecraft one based on the slot!"
                                onClick={async () => {
                                    if (boxOpen) return;
                                    setBoxOpen(true);
                                    const { response } =
                                        await window.electronAPI.showConfirmation(
                                            {
                                                title: "Warning!",
                                                message:
                                                    "Are you sure you want to reset this skin?\nThis cannot be undone!",
                                                type: "warning",
                                                buttons: [
                                                    "Nevermind!",
                                                    "Reset to default",
                                                ],
                                                defaultId: 0,
                                            },
                                        );
                                    setBoxOpen(false);

                                    if (response === 1) {
                                        await window.electronAPI.resetSkin({
                                            profile: profileId,
                                            skin,
                                        });
                                        return;
                                    }
                                }}
                            >
                                Reset to default
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
