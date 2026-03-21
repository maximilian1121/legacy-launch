interface DividerProps {
    direction?: "horizontal" | "vertical";
}

export default function Divider({ direction = "horizontal" }: DividerProps) {
    const isVertical = direction === "vertical";

    return (
        <div
            role="separator"
            aria-orientation={direction}
            className={`
                bg-stone-500 shrink-0 self-stretch block opacity-100
                ${isVertical ? "w-0.5 h-auto min-h-4 mx-2" : "h-0.5 w-auto min-w-4 my-2"}
            `}
            style={{
                border: "none",
                flexShrink: 0,
            }}
        />
    );
}
