// components/ui-buttons/CloseButton.tsx
"use client";

import React from "react";
import { PoiStore } from "@/app/hooks/PoiStore";

type CloseButtonProps = {
    onClose: () => void;
};

const CloseButton = ({ onClose }: CloseButtonProps) => {
    const { selectPoi } = PoiStore();

    const handleClick = () => {
        selectPoi(null);
        onClose();
    };

    return (
        <button onClick={handleClick} aria-label="Close">
            <img src="/logo/close.svg" alt="close" />
        </button>
    );
};

export default CloseButton;
