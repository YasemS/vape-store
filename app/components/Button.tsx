import cn from "~/lib/cn";

export type ButtonProps = React.ComponentProps<"button"> & {
  size?: "sm" | "base" | "lg";
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  className,
  size = "base",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-1 px-8 h-12 bg-orange-500 ring-3 ring-transparent rounded-full outline-none transition-transform text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 hover:scale-102 active:scale-104 active:ring-orange-500/25",
        variant === "secondary" &&
          "bg-zinc-100 text-black active:ring-black/25",
        variant === "outline" &&
          "bg-white border border-zinc-500 text-black active:ring-black/25",
        className
      )}
      {...props}
    />
  );
}

export function IconButton({ className, ...props }: ButtonProps) {
  return <Button className={cn("p-0 h-10 w-10", className)} {...props} />;
}
