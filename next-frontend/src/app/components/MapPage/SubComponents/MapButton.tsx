
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active: boolean;
  logo?: string;
}

export const MapButton = ({ children, active, logo, ...props }: MapButtonProps) => {
    // TODO: This should be a button component that we use throughout the application, try to make components that look like the figma
    // That way small design changes can be made all in one place.
    return (
        <button
            className={`
                bg-galaxy-purple flex px-4 py-2.5 justify-center items-center gap-2
                border-2 border-light-purple rounded-xl text-white
                hover:bg-another-purple
                ${active ? "bg-light-purple" : "bg-galaxy-purple"}
            `}
            {...props}
        >
            {logo && <img src={logo} alt={"button logo"} className={'w-5 h-5'} />}
            {children}
        </button>
    );
};

export default MapButton;