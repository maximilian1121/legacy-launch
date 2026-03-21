import { useEffect, useState, FormEvent } from "react";
import Dialog from "./Dialog";
import TextField from "./TextField";
import Select from "./Select";
import Button from "./Button";
import { IoMdCode } from "react-icons/io";

type CreateProfileDialogProps = {
    open: boolean;
    onClose: (startProcessing: boolean) => void;
    stopProcessing: () => void;
};

const BRANCH_OPTIONS = [
    {
        label: "Nightly (github.com/smartcmd/MinecraftConsoles)",
        value: "nightly",
        url: "https://github.com/smartcmd/MinecraftConsoles",
    },
    {
        label: "Faucet (github.com/ytsodacan/Faucet)",
        value: "Faucet",
        url: "https://github.com/ytsodacan/Faucet",
    },
];

export default function CreateProfileDialog({
    open,
    onClose,
    stopProcessing,
}: CreateProfileDialogProps) {
    const [profileName, setProfileName] = useState("");
    const [profileBranch, setProfileBranch] = useState("nightly");
    const [profileNameError, setProfileNameError] = useState<string | null>(
        null,
    );

    useEffect(() => {
        if (profileName.length > 0 && profileName.trim().length < 1) {
            setProfileNameError("Name must be at least 1 character");
        } else {
            setProfileNameError(null);
        }
    }, [profileName]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (profileName.trim().length < 1) {
            setProfileNameError("Name must be at least 1 character");
            return;
        }

        onClose(true);

        await window.electronAPI.createProfile({
            channel: profileBranch,
            name: profileName,
        });

        stopProcessing();
    };

    const handleCancel = () => {
        onClose(false);
        setProfileName("");
        setProfileBranch("nightly");
    };

    const selectedUrl = BRANCH_OPTIONS.find(
        (b) => b.value === profileBranch,
    )?.url;

    return (
        <Dialog title="Create Profile" open={open}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextField
                    label="Profile Name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    error={profileNameError}
                    placeholder="Enter profile name..."
                />

                <div className="flex flex-col gap-1">
                    <Select
                        label="Version"
                        value={profileBranch}
                        onChange={(e) => setProfileBranch(e.target.value)}
                        options={BRANCH_OPTIONS}
                    />
                    {selectedUrl && (
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.electronAPI.openExternal(selectedUrl);
                            }}
                            className="text-sm text-blue-500 underline cursor-pointer w-fit flex items-center gap-1 leading-none"
                        >
                            View source
                            <IoMdCode className="text-lg" />
                        </a>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        className="back-sfx"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!!profileNameError || !profileName}
                    >
                        Create
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
