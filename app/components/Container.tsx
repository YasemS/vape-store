import cn from "~/lib/cn";

type ContainerProps = React.ComponentProps<"div">;

export default function Container({ className, ...props }: ContainerProps) {
  return <div className={cn("max-w-[1280px] mx-auto", className)} {...props} />;
}
