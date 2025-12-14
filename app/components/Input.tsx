import cn from "~/lib/cn";

export type InputProps = React.ComponentProps<"input">;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full px-3 appearance-none bg-white border border-zinc-200 rounded outline-none transition-all placeholder:text-black/30 hover:border-zinc-400 focus:border-orange-500",
        className
      )}
      {...props}
    />
  );
}
