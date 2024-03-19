import { cn } from "@/lib/utils";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CheckBoxInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="inline-flex items-center">
        <label
          className="relative flex cursor-pointer items-center rounded-full p-3"
          htmlFor="customStyle"
        >
          <input
            type="checkbox"
            className={cn(
              `before:content[''] before:bg-blue-gray-500
              peer relative h-8 
              w-8
              cursor-pointer 
              appearance-none rounded-full
              border
              border-gray-900/20
              bg-gray-900/10 transition-all before:absolute before:left-2/4
              before:top-2/4 before:block before:h-12 before:w-12
              before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0
              before:transition-opacity checked:border-700 checked:bg-700
              checked:before:bg-700 hover:scale-105 hover:before:opacity-0
              dark:border-300 dark:bg-900/20
              dark:checked:border-300
               dark:checked:bg-300
              dark:checked:before:bg-300`,
              className,
            )}
            id="customStyle"
            ref={ref}
            {...props}
          />
          <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
      </div>
    );
  },
);

CheckBoxInput.displayName = "CheckBoxInput";

export { CheckBoxInput };
