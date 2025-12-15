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
        "flex items-center justify-center px-8 h-12 bg-orange-500 ring-3 ring-transparent rounded-full outline-none transition-transform text-white font-bold cursor-pointer hover:scale-102 active:scale-104 focus:ring-orange-500/25",
        variant === "secondary" && "bg-zinc-100 text-black",
        variant === "outline" &&
          "bg-white border border-zinc-500 text-black focus:ring-black/25",
        className
      )}
      {...props}
    />
  );
}

export function IconButton({ className, ...props }: ButtonProps) {
  return <Button className={cn("p-0 h-10 w-10", className)} {...props} />;
}
