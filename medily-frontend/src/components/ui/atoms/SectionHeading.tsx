import React from "react";

interface SectionHeadingProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
    return (
        <>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </>
    );
};

export default SectionHeading;