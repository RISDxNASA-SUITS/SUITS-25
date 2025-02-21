
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface MapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active: boolean;
}

export const MapButton = ({ children, active, ...props }: MapButtonProps) => {
    // TODO: This should be a button component that we use throughout the application, try to make components that look like the figma
    // That way small design changes can be made all in one place.
    return (
        <button className={`shadow ${active ? "bg-red-700" : "bg-purple-600"} p-2 rounded text-white`} {...props}>
            {children}
        </button>
    );
};

export default MapButton;