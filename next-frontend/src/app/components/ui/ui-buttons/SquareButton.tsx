import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    active?: boolean;
    logo?: string;
}

export const SquareButton = ({ children, active, logo, disabled, ...props }: MapButtonProps) => {
    return (
        <button
            className={`
                flex flex-1 px-4 py-4 justify-center items-center gap-2
                border border-light-purple rounded-xl text-white transition-all duration-150
                ${disabled ? "opacity-60 bg-galaxy-purple cursor-not-allowed" : ""}
                ${active ? "bg-light-purple" : "bg-galaxy-purple"}
                hover:bg-another-purple
                active:bg-light-purple
              `}
            disabled={disabled}
            {...props}
        >
            {logo && <img src={logo} alt="button logo" className="w-8 h-8" />}
            {children}
        </button>
    );
};

export default SquareButton;
