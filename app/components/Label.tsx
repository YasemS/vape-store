import cn from "~/lib/cn";

export type LabelProps = React.ComponentProps<"label">;

export default function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-xs font-medium leading-3", className)}
      {...props}
    />
  );
}
