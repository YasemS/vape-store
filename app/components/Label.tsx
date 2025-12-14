import cn from "~/lib/cn";

export type LabelProps = React.ComponentProps<"label">;

export default function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium leading-3.5", className)}
      {...props}
    />
  );
}
