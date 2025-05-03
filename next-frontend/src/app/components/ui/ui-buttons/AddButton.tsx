import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    active?: boolean;
    logo?: string;
}

export const AddButton = ({ children, active, logo, disabled, ...props }: MapButtonProps) => {
    return (
        <button
            className={`
                order-1 flex justify-center items-center gap-2 shrink-[2] p-4
                rounded-xl text-white transition-all duration-150
                ${disabled ? "opacity-60 bg-galaxy-purple cursor-not-allowed" : ""}
                ${active ? "bg-light-purple" : "bg-galaxy-purple"}
                hover:bg-another-purple
                active:bg-light-purple
              `}
            {...props}
        >
            {logo && <img src={logo} alt="button logo" className="w-8 h-8" />}
            {children}
        </button>
    );
};

export default AddButton;
