import React, { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    // Explicitly defining these for clarity in a controlled setup
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextField({
    label,
    error,
    id,
    className = "",
    value,
    onChange,
    ...props
}: TextFieldProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-stone-300"
                >
                    {label}
                </label>
            )}

            <input
                id={inputId}
                value={value}
                onChange={onChange}
                className={`
                    px-3 py-2 border rounded-md outline-none transition-all
                    ${
                        error
                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#49753b] focus:ring-1 focus:ring-[#49753b]"
                    }
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    bg-transparent
                `}
                {...props}
            />

            {error && (
                <span className="text-xs text-red-500 mt-1" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
