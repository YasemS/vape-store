import cn from "~/lib/cn";

type PaymentMethodContainerProps = React.ComponentProps<"div"> & {
  active?: boolean;
};
type PaymentMethodButtonProps = React.ComponentProps<"button">;
type PaymentMethodContentProps = React.ComponentProps<"div">;
type PaymentMethodIconsProps = React.ComponentProps<"div">;
type PaymentMethodIconProps = React.ComponentProps<"img">;

export function PaymentMethodContainer({
  active,
  children,
  ...props
}: PaymentMethodContainerProps) {
  return (
    <div
      className={cn(
        "group border border-zinc-200 rounded ring-1 ring-transparent transition-colors",
        active ? "border-black ring-black" : "hover:border-zinc-400"
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PaymentMethodButton({
  children,
  ...props
}: PaymentMethodButtonProps) {
  return (
    <button
      className="flex items-center gap-3 w-full p-4 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}

export function PaymentMethodContent({
  className,
  children,
  ...props
}: PaymentMethodContentProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 p-4 border-t-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PaymentMethodIcons({
  children,
  ...props
}: PaymentMethodIconsProps) {
  return (
    <div className="flex gap-0.5 ml-auto" {...props}>
      {children}
    </div>
  );
}

export function PaymentMethodIcon({
  children,
  ...props
}: PaymentMethodIconProps) {
  return <img className="h-6 rounded-xs" {...props} />;
}
