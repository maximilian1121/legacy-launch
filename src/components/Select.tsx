import React, { SelectHTMLAttributes } from "react";

interface Option {
    label: string;
    value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Option[];
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
}

export default function Select({
    label,
    error,
    id,
    className = "",
    options,
    value,
    onChange,
    placeholder,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-stone-300"
                >
                    {label}
                </label>
            )}

            <select
                id={selectId}
                value={value}
                onChange={onChange}
                className={`
                    px-3 py-2 border rounded-md outline-none transition-all appearance-none
                    ${
                        error
                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#49753b] focus:ring-1 focus:ring-[#49753b]"
                    }
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    bg-transparent
                `}
                {...props}
            >
                {placeholder && (
                    <option value="" className="text-black" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map((option) => (
                    <option
                        className="text-stone-100 bg-stone-700"
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <span className="text-xs text-red-500 mt-1" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
