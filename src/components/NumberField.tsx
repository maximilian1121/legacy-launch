import React from "react";
import TextField from "./TextField"; // Adjust path as needed

interface NumberFieldProps {
    label?: string;
    error?: string;
    value: number;
    onChange: (value: number) => void;
    className?: string;
    title?: string;
}

export default function NumberField({
    label,
    error,
    value,
    onChange,
    className = "",
    title = "",
}: NumberFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onChange(isNaN(newValue) ? 0 : newValue);
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <TextField
                label={label}
                error={error}
                type="number"
                value={value.toString()}
                onChange={handleChange}
                title={title}
            />
        </div>
    );
}
