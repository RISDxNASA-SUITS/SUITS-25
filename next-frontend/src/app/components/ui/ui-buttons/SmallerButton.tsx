import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    active?: boolean;
    logo?: string;
}

export const SmallerButton = ({ children, active, logo, disabled, ...props }: MapButtonProps) => {
    return (
        <button
            className={`
                flex flex-1 px-5 py-1 justify-center items-center gap-2
                border border-white rounded-lg text-white transition-all duration-150 w-full
                ${disabled ? "opacity-60 bg-galaxy-purple cursor-not-allowed" : ""}
                ${active ? "bg-light-purple" : "bg-galaxy-purple"}
                hover:bg-another-purple
              `}
            disabled={disabled}
            {...props}
        >
            {logo && <img src={logo} alt="button logo" className="w-5 h-5" />}
            {children}
        </button>
    );
};

export default SmallerButton;
