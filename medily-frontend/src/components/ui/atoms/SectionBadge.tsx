import React from "react";

interface SectionBadgeProps {
    text: string;
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ text }) => {
    return <p className="section-label">{text}</p>;
};

export default SectionBadge;