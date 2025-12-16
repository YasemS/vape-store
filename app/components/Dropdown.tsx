import cn from "~/lib/cn";

export type DropdownProps = React.ComponentProps<"div"> & {
  position?: "left" | "center" | "right";
};

export default function Dropdown({
  className,
  position = "left",
  ...props
}: DropdownProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start absolute top-full translate-y-1 min-w-48 px-4 py-3 bg-white border border-zinc-200 rounded-lg animate-dropdown",
        position === "left" && "left-0",
        position === "center" && "left-1/2 -translate-x-1/2",
        position === "right" && "right-0",
        className
      )}
      {...props}
    />
  );
}
