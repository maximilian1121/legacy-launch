import { useEffect, useState } from "react";
import Divider from "./Divider";
import SkinViewer from "./SkinViewer";
import Select from "./Select";
import Button from "./Button";
import Checkbox from "./CheckBox";
import TextField from "./TextField";
import NumberInput from "./NumberField";

type ProfileMenuProps = {
    open: boolean;
    onClose: () => void;
    profileId: string;
};

const argTranslations = new Map([
    ["-bind", "Binding IP address"],
    ["-port", "Binding PORT"],
    ["-name", "Username"],
    ["-server", "Headless server mode"],
]);
const argTooltips = new Map([
    [
        "-bind",
        "What IP address to bind to when in server mode, if you don't know what you are doing leave it at 0.0.0.0.",
    ],
    ["-port", "What port to bind to when in server mode."],
    ["-name", "What username you want to play Minecraft with."],
    ["-server", "Whether or not you want to boot into a headless server mode."],
]);

export default function ProfileMenu({
    open,
    onClose,
    profileId,
}: ProfileMenuProps) {
    const [profileName, setProfileName] = useState("");
    const [profileArgs, setProfileArgs] = useState<Record<string, unknown>>();
    const [profileFlags, setProfileFlags] = useState<Record<string, unknown>>();
    const [skin, setSkin] = useState("char.png");
    const [skinVer, setSkinVer] = useState(0);
    const [boxOpen, setBoxOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

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

    const handleApply = async () => {
        if (!isDirty) return;

        await window.electronAPI.setStoreValue(
            `profiles.${profileId}.args`,
            profileArgs,
        );
        await window.electronAPI.setStoreValue(
            `profiles.${profileId}.flags`,
            profileFlags,
        );
        await window.electronAPI.setStoreValue(
            `profiles.${profileId}.name`,
            profileName,
        );

        setIsDirty(false);
    };

    const handleArgChange = (key: string, value: string | number) => {
        setProfileArgs((prev) => ({
            ...prev,
            [key]: value,
        }));
        setIsDirty(true);
    };

    const handleFlagChange = (key: string, value: boolean) => {
        setProfileFlags((prev) => ({
            ...prev,
            [key]: value,
        }));
        setIsDirty(true);
    };

    const updateProfileName = async () => {
        setProfileName(
            await window.electronAPI.getStoreValue(
                `profiles.${profileId}.name`,
            ),
        );
        setProfileArgs(
            await window.electronAPI.getStoreValue(
                `profiles.${profileId}.args`,
            ),
        );
        setProfileFlags(
            await window.electronAPI.getStoreValue(
                `profiles.${profileId}.flags`,
            ),
        );
        setIsDirty(false);
    };

    useEffect(() => {
        const cleanup = window.electronAPI.onSkinUpdated(async () => {
            setSkinVer((prev) => prev + 1);
        });
        updateProfileName();

        return () => cleanup();
    }, [open]);

    const handleClose = async () => {
        if (isDirty) {
            setBoxOpen(true);
            const { response } = await window.electronAPI.showConfirmation({
                title: "Warning!",
                message:
                    "You have unsaved changes!\nAre you sure you want to close?",
                type: "warning",
                buttons: [
                    "No, don't close!",
                    "Save and close!",
                    "Yes, discard!",
                ],
                defaultId: 0,
            });
            setBoxOpen(false);

            if (response === 1) {
                await handleApply();
                onClose();
            } else if (response === 2) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <div
            className={`${!open && "hidden"} aspect-square w-screen h-screen bg-[rgba(0,0,0,0.2)] 
        fixed top-0 left-0 bottom-0 right-0 z-100 flex
        justify-center items-center align-middle`}
        >
            <div className="fixed flex flex-col text-white bg-stone-700 px-4 py-4 min-w-[90vw] min-h-[90vh] max-h-[90vh] shadow-xl rounded-2xl shadow-stone-900">
                <span className="flex justify-between align-middle items-center">
                    <h1 className="text-2xl">Profile - {profileName}</h1>
                    <span className="flex justify-end gap-2">
                        <Button onClick={handleApply} disabled={!isDirty}>
                            Apply
                        </Button>
                        <Button
                            className="back-sfx"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </span>
                </span>
                <Divider />
                <div className="gap-2 flex flex-col h-full overflow-auto">
                    <h1 className="text-xl">Profile Name</h1>
                    <TextField
                        value={profileName}
                        onChange={(e) => {
                            setProfileName(e.target.value);
                            setIsDirty(true);
                        }}
                    />
                    <Divider />
                    <h1 className="text-xl">CLI Arguments</h1>
                    {profileArgs &&
                        Object.entries(profileArgs).map(([key, value]) => {
                            if (typeof value === "string") {
                                return (
                                    <TextField
                                        key={key}
                                        value={value}
                                        onChange={(e) =>
                                            handleArgChange(key, e.target.value)
                                        }
                                        label={argTranslations.get(key)}
                                        title={argTooltips.get(key)}
                                    />
                                );
                            }
                            if (typeof value === "number") {
                                return (
                                    <NumberInput
                                        key={key}
                                        value={value}
                                        onChange={(val: number) =>
                                            handleArgChange(key, val)
                                        }
                                        label={argTranslations.get(key)}
                                        title={argTooltips.get(key)}
                                    />
                                );
                            }
                            return null;
                        })}
                    <Divider />
                    <h1 className="text-xl">CLI Flags</h1>
                    {profileFlags &&
                        Object.entries(profileFlags).map(
                            ([key, value]) =>
                                typeof value === "boolean" && (
                                    <Checkbox
                                        key={key}
                                        checked={value}
                                        onChange={(e) =>
                                            handleFlagChange(
                                                key,
                                                e.target.checked,
                                            )
                                        }
                                        label={argTranslations.get(key)}
                                        title={argTooltips.get(key)}
                                    />
                                ),
                        )}
                    <Divider />
                    <h1 className="text-xl">Skins</h1>
                    <Select
                        options={skins.map((skin, index) => ({
                            label: `Skin ${index + 1}`,
                            value: skin,
                        }))}
                        value={skin}
                        onChange={(e) => {
                            setSkin(e.target.value);
                        }}
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
                            <h1>Skin options</h1>
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
                                Swap
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
                    <h1 className="text-stone-500">Profile id: {profileId}</h1>
                </div>
            </div>
        </div>
    );
}
