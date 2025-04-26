import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface TertiaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    logo?: string;
}

export const TertiaryButton = ({ children, logo, ...props }: TertiaryButtonProps) => {
    return (
        <button
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl 
                border border-light-purple 
                bg-light-purple/0 
                backdrop-blur-sm 
                text-light-purple 
                transition-all 
                active:border-2 active:bg-light-purple/60`}
            {...props}
        >
            {logo && <img src={logo} alt="tertiary button logo" className="w-5 h-5" />}
            {children}
        </button>
    );
};

export default TertiaryButton;
