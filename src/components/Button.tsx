import React from "react";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[14px] py-2.5 px-3.5",
  md: "text-[16px] py-2.5 px-4",
  lg: "text-[16px] py-3.5 px-5",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#038561] text-white hover:bg-[#038561]/90",
  secondary: "bg-gray-hover text-gray-dark hover:bg-[#ebebeb]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({ size = "md", variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium leading-[1.2] transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function LinkButton({ size = "md", variant = "primary", className = "", children, ...props }: LinkButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium leading-[1.2] transition-colors no-underline ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
