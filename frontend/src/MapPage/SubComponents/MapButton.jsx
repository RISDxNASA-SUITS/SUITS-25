
import React from 'react';



export const MapButton = ({ children,active,  ...props }) => {
    return (
        <button className={`shadow ${active? "bg-red-700": "bg-purple-600"} p-2 rounded text-white`} {...props}>
            {children}
        </button>
    );
};

export default MapButton;