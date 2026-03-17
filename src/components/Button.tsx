import React, { ButtonHTMLAttributes } from "react";

// Define the custom props we want to add
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export default function Button({
    variant = "primary",
    className = "",
    children,
    ...props
}: ButtonProps) {
    const variantStyles = {
        primary: "bg-[#49753b] hover:bg-[color-mix(in_srgb,#49753b,black_15%)]",
        secondary:
            "bg-[#6f5236] hover:bg-[color-mix(in_srgb,#6f5236,black_15%)]",
    };

    const baseStyles =
        "select-none cursor-pointer rounded-2xl text-white px-4 py-2 transition-colors";

    const combinedClasses =
        `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
