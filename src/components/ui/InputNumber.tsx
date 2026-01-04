import * as React from "react";
import { cn } from "@/lib/utils";
import { InputText, InputProps } from "./InputText";

export interface InputNumberProps extends Omit<InputProps, "type"> {
  min?: number;
  max?: number;
  step?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({ className, min, max, step, ...props }, ref) => {
    return (
      <InputText
        type="number"
        min={min}
        max={max}
        step={step}
        className={cn("font-mono", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputNumber.displayName = "InputNumber";

export { InputNumber };
