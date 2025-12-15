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
          "h-10 w-full px-3 pr-10 appearance-none bg-white border border-zinc-200 ring-3 ring-transparent rounded outline-none transition-all text-sm placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500 focus:ring-orange-500/25",
          className
        )}
        onFocus={onSelectFocus}
        onBlur={onSelectBlur}
        {...props}
      />

      <ChevronDown
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform",
          focused && "rotate-180"
        )}
      />
    </div>
  );
}
