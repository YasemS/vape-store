import cn from "~/lib/cn";

export type InputGroupProps = React.ComponentProps<"div">;

export default function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} {...props} />
  );
}
