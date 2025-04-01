import React, {ButtonHTMLAttributes, ReactNode} from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;
    logo?: string;
}

export const SecondaryButton = ({children, logo, ...props} : SecondaryButtonProps) => {
    return (
        <button
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-light-purple w-full
                backdrop-blur-sm transition-all text-light-purple
                hover:border-2
                active:border-2 active:bg-white/10`}
            {...props}
        >
            {logo && <img src={logo} alt="secondary button logo" className="w-5 h-5" />}
            {children}
        </button>
    )
}