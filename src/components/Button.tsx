import React from "react";

type ButtonSize = "tag" | "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "white" | "dark";

const sizeClasses: Record<ButtonSize, string> = {
  tag: "text-[14px] py-2 px-3",
  sm: "text-[14px] py-2.5 px-3.5",
  md: "text-[16px] py-3 px-4",
  lg: "text-[16px] py-3.5 px-5",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#038561] text-white hover:bg-[#038561]/90",
  secondary: "bg-gray-hover text-gray-dark hover:bg-[#ebebeb]",
  white: "bg-white text-gray-dark hover:bg-gray-hover",
  dark: "bg-gray-dark text-white hover:bg-[#222]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: string;
};

export function Button({ size = "md", variant = "primary", rounded = "rounded-lg", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 ${rounded} font-medium leading-[1.2] transition-colors disabled:opacity-50 disabled:cursor-default ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
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
