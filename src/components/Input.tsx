import { cn } from "@/lib/utils";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          `border-input dark:placeholder:text-50/20"
            id="custom-input
            w-full
            rounded-[10px]
            border
            border-500
            bg-900/10
            px-3
            py-2 text-sm ring-300 placeholder:italic
            placeholder:text-900/20
            focus-visible:outline-none
            focus-visible:ring-0
            focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
