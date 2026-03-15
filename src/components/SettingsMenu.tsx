import { useEffect, useState } from "react";
import Button from "./Button";
import Checkbox from "./CheckBox";
import Dialog from "./Dialog";
import Divider from "./Divider";
import Select from "./Select";

type SettingsMenuProps = {
    onClose: () => void;
    open: boolean;
};

export default function SettingsMenu({ onClose, open }: SettingsMenuProps) {
    const [boxOpen, setBoxOpen] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [useSystemFrame, setUseSystemFrame] = useState(false);
    const [enableSFX, setEnableSFX] = useState(false);
    const [pano, setPano] = useState("TU46");

    const loadConfig = async () => {
        const frame = await window.electronAPI.getStoreValue(
            "settings.system_frame",
        );
        const sfx = await window.electronAPI.getStoreValue("settings.sfx");
        const currentPano =
            await window.electronAPI.getStoreValue("settings.pano");
        setUseSystemFrame(frame);
        setEnableSFX(sfx);
        setDirty(false);
        setPano(currentPano);
    };

    const handleSave = async () => {
        await window.electronAPI.setStoreValue(
            "settings.system_frame",
            useSystemFrame,
        );
        await window.electronAPI.setStoreValue("settings.sfx", enableSFX);
        await window.electronAPI.setStoreValue("settings.pano", pano);
        setDirty(false);
    };

    const handleClose = async () => {
        if (boxOpen) return;

        if (!dirty) {
            onClose();
            return;
        }

        setBoxOpen(true);
        const { response } = await window.electronAPI.showConfirmation({
            title: "Warning!",
            message:
                "You have unsaved changes!\nAre you sure you want to close?",
            type: "warning",
            buttons: ["No, don't close!", "Save and close!", "Yes, discard!"],
            defaultId: 0,
        });
        setBoxOpen(false);

        if (response === 1) {
            await handleSave();
            onClose();
        } else if (response === 2) {
            onClose();
        }
    };

    useEffect(() => {
        if (open) loadConfig();
    }, [open]);

    return (
        <Dialog title="Settings" open={open}>
            <div className="flex flex-col gap-2">
                <h1 className="text-lg">General</h1>

                <Checkbox
                    label="Enable SFX in launcher"
                    checked={enableSFX}
                    onChange={(e) => {
                        setEnableSFX(e.target.checked);
                        setDirty(true);
                    }}
                    title="Whether or not to play legacy console gui sounds in the launcher"
                />

                <Divider />

                <h1 className="text-lg">Appearance</h1>

                <Divider />

                <Select
                    label="Background panorama"
                    options={[
                        { label: "Build 0016", value: "BUILD_0016" },
                        { label: "Build 0054 Night", value: "BUILD_0054_N" },
                        { label: "Build 0054 Day", value: "BUILD_0054_D" },
                        { label: "TU5 Day", value: "TU5_D" },
                        { label: "TU5 Night", value: "TU5_N" },
                        { label: "TU7 Day", value: "TU7_D" },
                        { label: "TU7 Night", value: "TU7_N" },
                        { label: "TU20 Day", value: "TU20_D" },
                        { label: "TU20 Night", value: "TU20_N" },
                        { label: "TU31 Day", value: "TU31_D" },
                        { label: "TU31 Night", value: "TU31_N" },
                        { label: "TU46 Day", value: "TU46_D" },
                        { label: "TU46 Night", value: "TU46_N" },
                        { label: "TU69 Day", value: "TU69_D" },
                        { label: "TU69 Night", value: "TU69_N" },
                    ]}
                    value={pano}
                    onChange={(e) => {
                        setPano(e.target.value);
                        setDirty(true);
                    }}
                />

                <Checkbox
                    label={
                        <>
                            Use system window frame{" "}
                            <span className="text-red-500 block text-xs">
                                Requires restart!
                            </span>
                        </>
                    }
                    checked={useSystemFrame}
                    onChange={(e) => {
                        setUseSystemFrame(e.target.checked);
                        setDirty(true);
                    }}
                    title="Recommended when using a window manager like Hyprland or you hate my window frame ):"
                />

                <span className="w-full flex gap-2">
                    <Button onClick={handleSave} disabled={!dirty}>
                        Apply
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </span>
            </div>
        </Dialog>
    );
}
