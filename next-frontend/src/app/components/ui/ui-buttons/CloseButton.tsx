// components/ui-buttons/CloseButton.tsx
"use client";

import React from "react";
import { PoiStore } from "@/app/hooks/PoiStore";

type CloseButtonProps = {
    onClose: () => void; // 추가적인 정리 로직만 외부에서 전달
};

const CloseButton = ({ onClose }: CloseButtonProps) => {
    const { selectPoi } = PoiStore();

    const handleClick = () => {
        selectPoi(null); // 모든 클로즈 버튼이 공통으로 실행할 로직
        onClose();       // 외부에서 추가적인 마커/팝업 제거 등 처리
    };

    return (
        <button onClick={handleClick} aria-label="Close">
            <img src="/logo/close.svg" alt="close" />
        </button>
    );
};

export default CloseButton;
