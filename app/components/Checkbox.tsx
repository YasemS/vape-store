import { Check } from "lucide-react";
import { type ComponentProps } from "react";
import cn from "~/lib/cn";

export type CheckboxProps = ComponentProps<"input">;

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <input
        type="checkbox"
        className={cn(
          "peer h-5 w-5 appearance-none rounded bg-white border border-zinc-200 ring-3 ring-transparent outline-none transition-all",
          "hover:border-zinc-400",
          "focus:border-orange-500 focus:ring-orange-500/25",
          "checked:border-orange-500 checked:bg-orange-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          className
        )}
        {...props}
      />
      <Check
        className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        strokeWidth={3}
      />
    </div>
  );
}
