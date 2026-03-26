import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "professional";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = "primary",
                                           className = "",
                                       }) => {
    return (
        <button className={`btn btn-${variant} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;