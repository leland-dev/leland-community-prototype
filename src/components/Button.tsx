import React from "react";

type ButtonSize = "tag" | "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "white" | "dark";

const sizeClasses: Record<ButtonSize, string> = {
  tag: "text-[12px] py-2 px-3.5",
  sm: "text-[12px] py-2.5 px-4",
  md: "text-[14px] py-3 px-5",
  lg: "text-[14px] py-3.5 px-6",
};

// Icon-only: horizontal padding matches vertical so the button is a circle.
const iconSizeClasses: Record<ButtonSize, string> = {
  tag: "text-[12px] p-2",
  sm: "text-[12px] p-2.5",
  md: "text-[14px] p-3",
  lg: "text-[14px] p-3.5",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#FFD96F] text-[#111111] hover:bg-[#F3C948]",
  secondary: "bg-gray-hover text-gray-dark hover:bg-[#ebebeb]",
  white: "bg-white text-gray-dark hover:bg-gray-hover",
  dark: "bg-gray-dark text-white hover:bg-[#3a3a3a]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: string;
  iconOnly?: boolean;
};

export function Button({ size = "md", variant = "primary", rounded = "rounded-lg", iconOnly = false, className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 ${iconOnly ? "rounded-full" : rounded} font-medium leading-[1.2] transition-colors disabled:opacity-50 disabled:cursor-default ${iconOnly ? iconSizeClasses[size] : sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: string;
};

export function LinkButton({ size = "md", variant = "primary", rounded = "rounded-lg", className = "", children, ...props }: LinkButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-1.5 ${rounded} font-medium leading-[1.2] transition-colors no-underline ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
