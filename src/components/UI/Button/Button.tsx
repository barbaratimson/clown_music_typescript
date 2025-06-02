import React, {forwardRef, HTMLAttributes} from "react";
import classNames from "classnames";

interface ButtonT {
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: "primary" | "highlighted"
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonT & HTMLAttributes<HTMLButtonElement>>(({
                                                                                               className,
                                                                                               children,
                                                                                               variant = "primary",
                                                                                               size = "md",
                                                                                               disabled = false,
                                                                                               ...props
                                                                                           }, ref) => {
    const baseClasses = classNames(
        "flex justify-center items-center",
        "transition-all duration-400",
        "rounded-[2px] text-white",
        {
            // Variants
            "hover:bg-white/20 hover:rounded-[8px] active:bg-white/70 active:rounded-[12px] active:duration-200 md:hover:bg-[rgba(255,247,247,0.5)] md:hover:rounded-[8px] md:active:bg-[rgba(255,247,247,0.7)] md:active:rounded-[12px]": variant === "primary",
            "bg-white/20 hover:bg-white/50 text-white active:bg-white/70": variant === "highlighted",

            // Sizes
            "min-w-[20px] min-h-[20px] p-[3px] text-sm": size === "sm",
            "min-w-[25px] min-h-[25px] p-[5px]": size === "md",
            "min-w-[30px] min-h-[30px] p-[8px] text-lg": size === "lg",

            // Disabled state
            "opacity-50 cursor-not-allowed": disabled,

            // Original styles
            "hover:rounded-[8px] active:rounded-[12px] active:duration-200": !disabled,
        },
        className
    );

    return (
        <button
            ref={ref}
            className={baseClasses}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;