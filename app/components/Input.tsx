import cn from "~/lib/cn";

export type InputProps = React.ComponentProps<"input">;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full px-3 appearance-none bg-white border border-zinc-200 ring-3 ring-transparent rounded outline-none transition-all text-sm placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500 focus:ring-orange-500/25",
        className
      )}
      {...props}
    />
  );
}
