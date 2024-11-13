
import React from 'react';



export const Mapbutton = ({ children, ...props }) => {
    return (
        <button className={"shadow bg-purple-600 p-2 rounded text-white"} {...props}>
            {children}
        </button>
    );
};

export default Mapbutton;