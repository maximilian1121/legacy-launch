import Divider from "./Divider";

type ProcessingProps = {
    title: string;
    progress?: number;
    max?: number;
    open: boolean;
};

export default function Processing({
    title,
    progress,
    max = 100,
    open = false,
}: ProcessingProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-stone-800 border border-stone-700 w-full max-w-md p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
                <h1 className="text-xl font-semibold text-stone-100">
                    {title}
                </h1>

                <Divider />

                <div className="py-2">
                    {progress !== undefined ? (
                        <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${(progress / max) * 100}%` }}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden relative">
                            <div
                                className="absolute inset-0 bg-linear-to-r from-transparent via-blue-400 to-transparent w-1/2"
                                style={{
                                    animation: "shimmer 1.5s infinite linear",
                                }}
                            />
                        </div>
                    )}
                </div>

                {progress !== undefined && (
                    <p className="text-right text-xs text-stone-400 font-mono">
                        {Math.round((progress / max) * 100)}%
                    </p>
                )}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `,
                }}
            />
        </div>
    );
}
