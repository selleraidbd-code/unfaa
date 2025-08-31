import React from "react";

interface ShinyEffectProps {
    left?: number;
    right?: number;
    top?: number;
    size?: number;
}

const ShinyEffect = ({ left, right, top, size = 500 }: ShinyEffectProps) => {
    const positionStyles: React.CSSProperties = {
        top: top !== undefined ? `${top}px` : undefined,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: -1,
        position: "absolute",
        ...(left !== undefined && { left: `${left}px` }),
        ...(right !== undefined && { right: `${right}px` }),
    };

    return <div className="shiny-effect" style={positionStyles}></div>;
};

export default ShinyEffect;
