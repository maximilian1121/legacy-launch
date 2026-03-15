import { useEffect, useRef } from "react";
import { IdleAnimation, Render } from "skin3d";

type SkinViewerProps = {
    profileId: string;
    skinName: string;
    skinVer: number;
};

export default function SkinViewer({
    profileId,
    skinName,
    skinVer,
}: SkinViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const viewer = new Render({
            canvas: canvasRef.current,
            width: 400,
            height: 800,
        });

        viewer.loadSkin(
            `app-assets:///profiles/${profileId}/Common/res/mob/${skinName}?v=${performance.now()}`,
        );

        viewer.controls.enablePan = false;
        viewer.controls.enableZoom = false;
        viewer.animation = new IdleAnimation();

        return () => {
            viewer.dispose();
        };
    }, [profileId, skinName, skinVer]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={800}
            className="aspect-1/2 max-w-50 max-h-100"
        />
    );
}
