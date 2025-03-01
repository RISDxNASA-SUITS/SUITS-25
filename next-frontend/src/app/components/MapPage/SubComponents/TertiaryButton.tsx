
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const TertiaryButton = ({ children, ...props }: MapButtonProps) => {
    // TODO: This should be a button component that we use throughout the application, try to make components that look like the figma
    // That way small design changes can be made all in one place.
    return (
        <button className={`bg-none w-fit min-w-[176px] py-3 px-6 rounded-xl text-light-purple 
        active:bg-white/10 hover:bg-white/5 disabled:opacity-60 font-sans font-medium text-xl`} {...props}>
            {children}
        </button>
    );
};

export default TertiaryButton;