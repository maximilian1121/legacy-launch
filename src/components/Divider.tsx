export default function Divider({ direction = "horizontal" }) {
    const isVertical = direction === "vertical";

    return (
        <hr
            className={`bg-stone-500 border-0 
        ${isVertical ? "w-0.5 h-full mx-2" : "w-full h-0.5 my-2"}`}
        />
    );
}
