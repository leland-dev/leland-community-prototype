import React from "react";
import { Button } from "./Button";

type ToggleChipProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  selected?: boolean;
  onClick?: () => void;
};

export function ToggleChip({ selected = false, className = "", children, ...props }: ToggleChipProps) {
  return (
    <Button
      size="sm"
      variant="secondary"
      rounded="rounded-full"
      className={`border-[1.5px] ${
        selected ? "border-[#222222]" : "border-transparent"
      } ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
