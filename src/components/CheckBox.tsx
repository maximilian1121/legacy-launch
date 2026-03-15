import React, { InputHTMLAttributes, useId } from "react";

interface CheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value"
> {
    // ReactNode allows strings OR JSX elements
    label?: React.ReactNode;
    error?: string;
    checked: boolean;
    title?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
    label,
    error,
    id,
    className = "",
    title,
    checked,
    onChange,
    ...props
}: CheckboxProps) {
    const reactId = useId();
    const inputId = id || reactId;

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={inputId}
                    checked={checked}
                    onChange={onChange}
                    title={title}
                    className={`
                        w-4 h-4 rounded border transition-all cursor-pointer
                        appearance-none checked:bg-[#49753b] checked:border-[#49753b]
                        bg-transparent relative
                        ${
                            error
                                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-gray-300 focus:ring-1 focus:ring-[#49753b]"
                        }
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        before:content-[''] before:absolute before:hidden checked:before:block
                        before:left-[4px] before:top-[1px] before:w-[4px] before:h-[8px]
                        before:border-white before:border-b-2 before:border-r-2 before:rotate-45
                    `}
                    {...props}
                />

                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-stone-300 cursor-pointer select-none"
                        title={title}
                    >
                        {label}
                    </label>
                )}
            </div>

            {error && (
                <span className="text-xs text-red-500" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
