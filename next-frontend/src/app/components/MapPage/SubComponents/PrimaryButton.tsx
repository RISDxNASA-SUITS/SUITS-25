
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const PrimaryButton = ({ children, ...props }: MapButtonProps) => {
    // TODO: This should be a button component that we use throughout the application, try to make components that look like the figma
    // That way small design changes can be made all in one place.
    return (
        <button className={` bg-galaxy-purple w-fit min-w-[176px] py-3 px-6 rounded-xl text-white border-2 border-light-purple
        hover:bg-another-purple disabled:opacity-60 active:bg-light-purple font-sans font-medium text-xl`} {...props}>
            {children}
        </button>
    );
};

export default PrimaryButton;