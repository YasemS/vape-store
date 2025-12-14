import { ChevronDown } from "lucide-react";
import { useState } from "react";

import cn from "~/lib/cn";

export type SelectProps = React.ComponentProps<"select">;

export default function Select({
  className,
  onFocus,
  onBlur,
  ...props
}: SelectProps) {
  const [focused, setFocused] = useState(false);

  function onSelectFocus(e: React.FocusEvent<HTMLSelectElement>) {
    setFocused(true);

    onFocus && onFocus(e);
  }

  function onSelectBlur(e: React.FocusEvent<HTMLSelectElement>) {
    setFocused(false);

    onBlur && onBlur(e);
  }

  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full px-3 pr-10 appearance-none bg-white border border-zinc-200 rounded outline-none transition-all placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500",
          className
        )}
        onFocus={onSelectFocus}
        onBlur={onSelectBlur}
        {...props}
      />

      <ChevronDown
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform",
          focused && "rotate-180"
        )}
      />
    </div>
  );
}
