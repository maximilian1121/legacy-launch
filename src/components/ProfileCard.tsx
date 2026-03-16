import { IoMdSettings } from "react-icons/io";
import Button from "./Button";
import IconButton from "./IconButton";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

type ProfileCardArgs = {
    name: string;
    source: string;
    id: string;
};

export default function ProfileCard({ name, source, id }: ProfileCardArgs) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <div
                className="
            bg-[oklch(21.6%_0.006_56.043/90%)]
          text-white
            transition-transform duration-100 
            ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
            hover:-translate-y-1 flex justify-between mb-2 px-4 py-4 rounded-2xl"
            >
                <div>
                    <h1 className="text-2xl">{name}</h1>
                    <h2>Release: {source}</h2>
                </div>
                <div className="flex gap-2 justify-end w-[40%] mt-2 mb-2">
                    <Button
                        className="w-[50%]"
                        onClick={() => {
                            window.electronAPI.launchProfile(id);
                        }}
                    >
                        Launch
                    </Button>
                    <IconButton
                        onClick={() => setMenuOpen(true)}
                        variant="secondary"
                    >
                        <IoMdSettings />
                    </IconButton>
                </div>
            </div>
            <ProfileMenu
                open={menuOpen}
                profileId={id}
                onClose={() => setMenuOpen(false)}
            />
        </>
    );
}
