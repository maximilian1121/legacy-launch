import Divider from "./Divider";

type DialogProps = {
    title: string;
    open: boolean;
    children?: React.ReactNode;
};

export default function Dialog({ title, open, children }: DialogProps) {
    return (
        <div
            className={`${!open && "hidden"} w-screen h-screen bg-[rgba(0,0,0,0.2)] 
        fixed top-0 left-0 bottom-0 right-0 z-100 flex
        justify-center items-center align-middle`}
        >
            <div className="fixed text-white bg-stone-700 px-4 py-4 aspect-square max-w-[90vw] min-h-[90vh] shadow-xl rounded-2xl shadow-stone-900">
                <h1 className="text-2xl">{title}</h1>
                <Divider />
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}
